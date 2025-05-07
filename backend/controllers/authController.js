const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Валідація довжини
  if (!email || !password || email.length > 50 || password.length > 100) {
    return res.status(400).json({ message: "Invalid input length." });
  }
  // SQL Injection/небезпечні символи
  const dangerous = /(\b(drop|select|insert|delete|update)\b|--|;)/i;
  if (dangerous.test(email)) {
    return res.status(400).json({ message: "Invalid characters in input." });
  }
  // Валідація email та пароля (RegExp)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, include a number and an uppercase letter."
    });
  }

  console.log("REGISTER HIT:", email); // <--- додай
  // Перевірка, чи існує юзер
  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (user) {
      console.log("EMAIL ALREADY EXISTS");
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword
    ]);

    console.log("REGISTERED SUCCESSFULLY");
    res.status(201).json({ message: "User created. Please log in." });
  } catch (err) {
    console.log("DB ERROR", err);
    res.status(500).json({ message: "Database error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.length > 50 || password.length > 100) {
    return res.status(400).json({ message: "Invalid input length." });
  }

  const dangerous = /(\b(drop|select|insert|delete|update)\b|--|;)/i;
  if (dangerous.test(email)) {
    return res.status(400).json({ message: "Invalid characters in input." });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    console.log("LOGIN SUCCESS:", email);
    res.status(200).json({ token });
  } catch (err) {
    console.error("LOGIN DB ERROR", err);
    res.status(500).json({ message: "Server error during login." });
  }
};
