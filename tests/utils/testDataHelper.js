const generateUniqueEmail = (domain = "mailinator.com") => {
  const now = new Date();
  const pad = (n, len = 2) => n.toString().padStart(len, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  const millisecond = pad(now.getMilliseconds(), 3);

  const formatted = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  return `test${formatted}@${domain}`;
};

module.exports = {
  generateUniqueEmail,
};
