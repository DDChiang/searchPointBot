let go = (() => {
  var _ref6 = _asyncToGenerator(function* (configList) {
    if (!config.length) {
      return;
    }

    const currConfig = configList.shift();

    yield initLoginFlow(currConfig);
    yield bingFlow();
    yield bingSearch();
    yield toggleAccount();
    yield go(configList); // call function again
  });

  return function go(_x3) {
    return _ref6.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const webdriver = require('selenium-webdriver');
const By = webdriver.By; // selector object
const until = webdriver.until; // 'until' helper object

const { ranNum, ranStr, ranChar } = require('./util');
const mobile = false;
let capabilities = {
  browserName: 'chrome'
};

if (mobile) {
  capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      mobileEmulation: {
        deviceName: 'Apple iPhone 5'
      }
    }
  };
}

const driver = new webdriver.Builder().forBrowser('chrome').withCapabilities(capabilities).build();

const config = require('./appConfig');
const selectors = {
  emailInput: 'input[type="email"]',
  submitInput: 'input[type="submit"]',
  passwordInput: 'input[type="password"].form-control',
  rewardsLink: 'a#sharedshell-rewards',
  offerCards: 'a.offer-cta', // count
  modal: '#modal-dialog-shield',
  slide: '.slide',
  slideNumbers: 'a#tour-next', // "next" buttons
  nextBttn: 'a#tour-next',
  searchInput: 'input[name="q"]',
  accountBttn: '.id_button',
  openAccountMenu: '.b_idOpen',
  toggleAccountBttn: '.b_toggle',
  accountSignInBttn: '.id_button #id_s'
};

const mobileSelectors = {
  emailInput: 'input[type="email"]',
  submitInput: 'input[type="submit"]',
  passwordInput: 'input[type="password"].form-control',
  // similarities end here
  menu: '#mHamburger',
  accountBttn: '#HBSignIn #hb_n',
  homeAccountBttn: '.shell-header-toggle-menu',
  homeMenuBar: '.shell-header-nav',
  homeToggleAccountBttn: '.shell-header-user-mobile-container',
  signOutBttn: '.msame_Drop_signOut',
  signedOutPage: '#signed-out-page',
  newSignInButton: '#sign-in-link'
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
const initLoginFlow = (() => {
  var _ref = _asyncToGenerator(function* (account) {
    console.log('init login');
    yield driver.get('https://login.live.com/');
    const elemEmail = yield driver.wait(elemLocated(selectors.emailInput), 2000);
    yield driver.wait(elemVisible(elemEmail), 2000);
    sendKeys(selectors.emailInput, account.login);
    clickElem(selectors.submitInput);

    console.log('password');
    const elem = yield driver.wait(elemLocated(selectors.passwordInput), 1000);

    yield driver.wait(elemVisible(elem), 1000);
    sendKeys(selectors.passwordInput, account.password);
    clickElem(selectors.submitInput);
  });

  return function initLoginFlow(_x) {
    return _ref.apply(this, arguments);
  };
})();

// Navigate to next site
const bingFlow = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    const elem = yield driver.wait(until.titleIs('Microsoft account | Home'), 1000);
    console.log('bing flow');
    yield driver.executeScript('window.open()');
    // await driver.close();
    const tabs = yield driver.getAllWindowHandles();
    const lastTab = tabs[tabs.length - 1];
    console.log(lastTab);

    yield driver.switchTo().window(lastTab);
    yield driver.navigate().to('https://www.bing.com');
  });

  return function bingFlow() {
    return _ref2.apply(this, arguments);
  };
})();

const bingSearch = (() => {
  var _ref3 = _asyncToGenerator(function* () {
    // still looking for old
    yield driver.wait(until.titleIs('Bing'), 1000);
    console.log('presearch');
    clickElem(selectors.searchInput);

    yield search(30);
  });

  return function bingSearch() {
    return _ref3.apply(this, arguments);
  };
})();

const search = (() => {
  var _ref4 = _asyncToGenerator(function* (count) {
    console.log('search!');
    let c = count;
    if (!c) {
      return;
    }
    const elem = yield driver.wait(elemLocated(selectors.searchInput), 2000);
    yield driver.wait(elemVisible(elem), 2000);
    const bingDriver = yield driver.sleep(ranNum(100, 500)).then(function () {
      sendKeys(selectors.searchInput, ranStr(1, 2)); // 4
      clickElem(selectors.submitInput);
    });
    --c;
    yield search(c);
  });

  return function search(_x2) {
    return _ref4.apply(this, arguments);
  };
})();

// toggle account: logout or login user
const toggleAccount = (() => {
  var _ref5 = _asyncToGenerator(function* () {
    console.log('logout');
    yield driver.sleep(200);
    clickElem(selectors.accountBttn);

    const elem = yield driver.wait(elemLocated(selectors.openAccountMenu), 1000);
    yield driver.wait(elemVisible(elem), 2000);
    clickElem(selectors.toggleAccountBttn);

    const signInBttn = yield driver.wait(elemLocated(selectors.accountSignInBttn), 3000);
    yield driver.wait(elemVisible(signInBttn), 2000);
  });

  return function toggleAccount() {
    return _ref5.apply(this, arguments);
  };
})();

;

go(config);

// driver.quit();