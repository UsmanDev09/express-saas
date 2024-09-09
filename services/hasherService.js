const bcrypt = require('bcrypt');

const generateValidationCode = (min = 1000, max = 9999) => {
  return randomInt(min, max).toString();
};

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomUsernameFromEmail = (email) => {
  const nameParts = email.replace(/@.+/, '');
  const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');

  const randomPart = randomInt(9999999999).toString();
  const randArr = Array.from(randomPart);
  const uniqueName =
    (name.length > 5 ? name.substring(0, 5) : name) +
    (Number(name.length) > 8
      ? name.substring(Number(name.length) - 2, Number(name.length) + 1)
      : '') +
    '_' +
    randomPart[randomInt(randArr.length)] +
    randomPart[randomInt(randArr.length)] +
    randomPart[randomInt(randArr.length)] +
    randomPart[randomInt(randArr.length)];
  return uniqueName;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (data, encrypted) => {
  return await bcrypt.compare(data, encrypted);
};

module.exports = {
  generateValidationCode,
  generateRandomUsernameFromEmail,
  hashPassword,
  comparePassword,
};