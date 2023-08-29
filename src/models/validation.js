const db = require("../config/db");

async function emailExists(email) {
  const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;
  const user = await db.get(sql, [email]);
  return !!user;
}

async function handleExists(handle) {
  const sql = `
        SELECT * FROM users
        WHERE handle = ?
    `;
  const user = await db.get(sql, [handle]);
  return !!user;
}

function isValidPassword(password) {
  if (password.length < 8 || password.length > 20) return false;

  const lowercase = /[a-z]/;
  const uppercase = /[A-Z]/;
  const digit = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    lowercase.test(password) &&
    uppercase.test(password) &&
    digit.test(password) &&
    specialChar.test(password)
  );
}

module.exports = {
  emailExists,
  isValidPassword,
  handleExists,
};
