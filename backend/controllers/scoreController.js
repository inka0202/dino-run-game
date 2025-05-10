const db = require("../database/db");

exports.saveScore = async (req, res) => {
  const userId = req.user.id;
  const { score } = req.body;

  if (!score || score < 0) {
    return res.status(400).json({ message: "Invalid score" });
  }

  try {
    //Get the current high_score
    const row = await db.get("SELECT high_score FROM users WHERE id = ?", [
      userId
    ]);
    const currentScore = row?.high_score || 0;

    //update only if the new score is larger
    if (score > currentScore) {
      await db.run("UPDATE users SET high_score = ? WHERE id = ?", [
        score,
        userId
      ]);
    }

    res.status(200).json({ message: "Score saved!" });
  } catch (err) {
    console.error("SAVE SCORE ERROR", err);
    res.status(500).json({ message: "Failed to save score" });
  }
};

exports.getScore = async (req, res) => {
  const userId = req.user.id;

  try {
    const row = await db.get("SELECT high_score FROM users WHERE id = ?", [
      userId
    ]);

    if (!row) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ high_score: row.high_score || 0 });
  } catch (err) {
    console.error("GET SCORE ERROR", err);
    res.status(500).json({ message: "DB error" });
  }
};
