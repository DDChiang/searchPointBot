const testStr = '0123456789abcdefghijklmnopqrstuvwxyz';

// random # generator
const ranNum = function(min, max, floor) {
  const randomNumber = Math.random()*(max - min) + min;

  if (floor) {
    return Math.floor(randomNumber);
  }
  return randomNumber;
}

// random character generator
const ranChar = () => {
  const testStrL = testStr.length;

  return testStr[ranNum(0, testStrL, true)];
}

// random string generator
const ranStr = (min, max) => {
  const strL = ranNum(min, max, true);
  let c;
  let newStr = '';

  for (c = 0; c < strL; c++) {
    newStr += ranChar();
  }
  return newStr;
};

module.exports = { ranNum, ranChar, ranStr };
