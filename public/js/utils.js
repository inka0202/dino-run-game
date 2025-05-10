function getToken() {
  return localStorage.getItem("token");
}

function isAuthenticated() {
  return !!getToken();
}
window.isAuthenticated = isAuthenticated;
window.getToken = getToken;
