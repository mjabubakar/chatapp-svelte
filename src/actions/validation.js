const usernameVal = (str) => {
  const accept = "abcdefghijklmnopqrstuvwxyz1234567890.-";
  const check = str.split(" ").length;
  if (check > 1) return false;
  for (let i = 0; i <= str.length - 1; i++) {
    const char = str[i];
    if (i === 0 || i === str.length - 1) {
      if (char === "-" || char === ".") return false;
    }
    if (!accept.includes(char.toLowerCase())) {
      return false;
    }
  }
  return true;
};

export const emailVal = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validation = (email, password, confirmPassword, username, bio) => {
  if (username.length < 4 || username.length > 20)
    "Username too long or too short";
  if (!usernameVal(username)) return "Invalid username.";
  if (!emailVal(email)) return "Invalid email address.";
  if (password.length < 6) return "Password too short.";
  if (password !== confirmPassword) return "Password did not match.";
  if (bio.length < 4 || bio.length > 30) return "Bio too short or too long.";
  return false;
};

export default validation;
