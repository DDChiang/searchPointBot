module.exports = [{ login: 'dchiang@cmginc.com', password: 'bd3emstang' }, { login: 'ddeechng@gmail.com', password: 'md3emstang' }, { login: 'ranLogin', password: 'ranPass' }];
let getMe = (() => {
  var _ref = _asyncToGenerator(function* () {
    return;
  });

  return function getMe() {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const webdriver = require('selenium-webdriver');
const By = webdriver.By; // selector object
const until = webdriver.until; // 'until' helper object

// var ranNum = util.ranNum;
// var ranStr = util.ranStr;
// var ranChar = util.ranChar;
// const {ranNum, ranStr, ranChar} = require('./util');
const driver = new webdriver.Builder().forBrowser('chrome').build();

// const util = require('./util');
// const config = require('./appConfig');
const selectors = {
  emailInput: 'input[type="email"]',
  submitInput: 'input[type="submit"]',
  passwordInput: 'input[type="password"].form-control',
  ranInput: 'input[name="random"]',
  rewardsLink: 'a#sharedshell-rewards',
  offerCards: 'a.offer-cta', // count
  modal: '#modal-dialog-shield',
  slide: '.slide',
  slideNumbers: 'a#tour-next', // "next" buttons
  nextBttn: 'a#tour-next',
  searchInput: 'input[name="q"]',
  accountBttn: '.id_button',
  openAccountMenu: '.b_idOpen',
  toggleAccountBttn: '.b_toggle'
};

/* Utility fns */
// TODO: Move Helpers Out
const clickElem = elemSelector => {
  return findElemByCss(elemSelector).click();
};
const sendKeys = (elemSelector, text) => {
  return findElemByCss(elemSelector).sendKeys(text);
};
const findElemByCss = elemSelector => {
  return driver.findElement(By.css(elemSelector));
};
const findMultElems = elemSelector => {
  return driver.findElements(By.css(elemSelector));
};
const elemLocated = elemSelector => {
  return until.elementLocated(By.css(elemSelector));
};
//!!! NOTE: only after element is returned from promise !!!
const elemVisible = returnedElem => {
  return until.elementIsVisible(returnedElem);
};

// // scroll
// driver.touchActions()
//   .scroll({x: 0, y: 1000})
//   .perform();

// login user
const initLoginFlow = account => {
  console.log('init login!');
  sendKeys(selectors.emailInput, account.login);
  clickElem(selectors.submitInput);
  driver.wait(elemLocated(selectors.passwordInput), 1000).then(elem => {
    driver.wait(elemVisible(elem), 1000).then(() => {
      sendKeys(selectors.passwordInput, account.password);
    });
  });
  clickElem(selectors.submitInput);
};

// TODO: improve this
const clickThroughOffers = () => {
  // Navigate dashboard
  driver.wait(until.titleIs('Microsoft account | Home'), 1000).then(() => {
    clickElem(selectors.rewardsLink);
  });

  driver.wait(until.titleIs('Microsoft account | Dashboard'), 1000).then(() => {
    // Go through cards
    // findMultElems(selectors.offerCards)
    //   .then((elemArray) => {
    //     elemArray.forEach((item, i) => {
    //         if (i === 0) {
    //           item.getAttribute('id').then((id) => {
    //             if (id.includes('welcome')) {
    //               item.click();
    //
    //               // go through modals
    //               driver.sleep(200)
    //                 .then(() => {
    //                   driver.wait(elemLocated(selectors.modal), 100)
    //                     .then((elem) => {
    //                       driver.wait(elemVisible(elem), 100)
    //                         .then(() => {
    //                           findMultElems(selectors.slideNumbers)
    //                             .then((slides) => {
    //                               // go through modal buttons
    //                               slides.forEach((slide, i) => {
    //                                 let slideSelector = selectors.modal;
    //                                 let c = 0;
    //
    //                                 while (c < i+1) {
    //                                   slideSelector+= ' + ' + selectors.slide;
    //                                   c++;
    //                                 }
    //                                 slideSelector+= ' ' + selectors.nextBttn;
    //
    //                                 driver.wait(elemLocated(slideSelector), 100)
    //                                   .then((elem) => {
    //                                     driver.wait(elemVisible(elem), 100)
    //                                       .getAttribute('id')
    //                                       .then((id) => {
    //                                         clickElem(slideSelector);
    //                                       });
    //                                   });
    //                               });
    //                             });
    //                         });
    //                     });
    //                 });
    //               return;
    //             } else {
    //               item.click();
    //               return;
    //             }
    //             // can't get this good yet
    //             // else {
    //             //   // TODO: right click!!!
    //             //   // driver.actions()
    //             //   //   .keyDown(COMMAND).click(item);
    //             //     driver.actions().
    //             //      keyDown(webdriver.Key.COMMAND).
    //             //      click(item);
    //             //   console.log('not welcome ad');
    //             // }
    //           });
    //         }
    //     });
    //   });
  });
};

// Navigate to next site
const bingFlow = () => {
  driver.executeScript('window.open()');
  driver.close();
  driver.getAllWindowHandles().then(tabs => {
    const lastTab = tabs[tabs.length - 1];

    driver.switchTo().window(lastTab);
    driver.navigate().to('https://www.bing.com');
    bingSearch();
    toggleAccount();
  });
};

const bingSearch = () => {
  clickElem(selectors.searchInput);

  for (var i = 0; i < 5; i++) {
    driver.sleep(ranNum(100, 500)).then(() => {
      sendKeys(selectors.searchInput, ranStr(1, 2)); // 4
      clickElem(selectors.submitInput);
    });
  }
};

;

// toggle account: logout or login user
const toggleAccount = () => {
  driver.sleep(200).then(() => {
    clickElem(selectors.accountBttn);
    driver.wait(elemLocated(selectors.openAccountMenu), 1000).then(elem => {
      driver.wait(elemVisible(elem), 2000).then(() => {
        clickElem(selectors.toggleAccountBttn);
      });
    });
  });
};
//
// const go = (configList) => {
//   if (!config.length) {
//     return;
//   }
//
//   var currConfig = configList.shift();
//
//   driver.get('https://login.live.com/');
//   initLoginFlow(currConfig);
//   bingFlow();
//   go(configList);
// };
//
// go(config);

// driver.quit();
const testStr = '0123456789abcdefghijklmnopqrstuvwxyz';

// random # generator
var ranNum = function (min, max, floor) {
  const randomNumber = Math.random() * (max - min) + min;

  if (floor) {
    return Math.floor(randomNumber);
  }
  return randomNumber;
};

// random character generator
var ranChar = () => {
  const testStrL = testStr.length;

  return testStr[ranNum(0, testStrL, true)];
};

// random string generator
var ranStr = (min, max) => {
  const strL = ranNum(min, max, true);
  let c;
  let newStr = '';

  for (c = 0; c < strL; c++) {
    newStr += ranChar();
  }
  return newStr;
};

// module.exports = { ranNum, ranChar, ranStr };
module.exports = { go: 'o' };
