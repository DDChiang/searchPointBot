const webdriver = require('selenium-webdriver');
const By = webdriver.By; // selector object
const until = webdriver.until; // 'until' helper object

const { ranNum, ranStr, ranChar } = require('./util');
const mobile = true;
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

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(capabilities)
    .build();

const config = require('./userConfig');
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
}

const mobileSelectors = {
    // emailInput: 'input[type="email"]',
    // submitInput: 'input[type="submit"]',
    // passwordInput: 'input[type="password"].form-control',
    // similarities end here
    menuBttn: '#mHamburger',
    accountBttn: '#HBSignIn #hb_n',
    homeAccountBttn: '.shell-header-toggle-menu',
    homeMenuBar: '.shell-header-nav',
    homeToggleAccountBttn: '.shell-header-user-mobile-container',
    signOutBttn: '.msame_Drop_signOut',
    signedOutPage: '#signed-out-page',
    newSignInButton: '#sign-in-link'
}

/* Utility fns */
// TODO: Move Helpers Out
const clickElem = (elemSelector) => {
  return findElemByCss(elemSelector).click();
};
const sendKeys = (elemSelector, text) => {
  return findElemByCss(elemSelector).sendKeys(text);
};
const findElemByCss = (elemSelector) => {
  return driver.findElement(By.css(elemSelector));
};
const findMultElems = (elemSelector) => {
  return driver.findElements(By.css(elemSelector));
};
const elemLocated = (elemSelector) => {
  return until.elementLocated(By.css(elemSelector))
};
//!!! NOTE: only after element is returned from promise !!!
const elemVisible = (returnedElem) => {
  return until.elementIsVisible(returnedElem);
};

const waitVisibleClick = async (elem, timeLocate, timeVisible, elemToClick) => {
    const elem1 = elem;
    const t1 = timeLocate || 2000;
    const t2 = timeVisible || 2000;
    const elem2 = elemToClick || elem;

    const locatedElem = await driver.wait(elemLocated(elem1), t1);
    await driver.wait(elemVisible(locatedElem), t2);
    clickElem(elem2);
};

// // scroll
// driver.touchActions()
//   .scroll({x: 0, y: 1000})
//   .perform();

// login user
const initLoginFlow = async (account) => {
  console.log('init login');
  await driver.get('https://login.live.com/');
  const elemEmail = await driver.wait(elemLocated(selectors.emailInput), 2000);
  await driver.wait(elemVisible(elemEmail), 2000);
  sendKeys(selectors.emailInput, account.login);
  clickElem(selectors.submitInput);

  console.log('password');
  const elem = await driver.wait(elemLocated(selectors.passwordInput), 1000);

  await driver.wait(elemVisible(elem), 1000);
  sendKeys(selectors.passwordInput, account.password);
  clickElem(selectors.submitInput);
}

// Navigate to next site
const bingFlow = async () => {
  const elem = await driver.wait(until.titleIs('Microsoft account | Home'), 1000);
  console.log('bing flow');
  await driver.executeScript('window.open()');
  // await driver.close();
  const tabs = await driver.getAllWindowHandles();
  const lastTab = tabs[tabs.length - 1];
  console.log(lastTab);

  await driver.switchTo().window(lastTab);
  await driver.navigate().to('https://www.bing.com');
};

const bingSearch = async () => { // still looking for old
  await driver.wait(until.titleIs('Bing'), 1000);
  console.log('presearch');
  clickElem(selectors.searchInput);

  await search(2);
}

const search = async (count) => {
    console.log('search!');
    let c = count;
    if (!c) {
        return;
    }
    const elem = await driver.wait(elemLocated(selectors.searchInput), 2000);
    await driver.wait(elemVisible(elem), 2000);
    const bingDriver = await driver.sleep(ranNum(100, 500))
        .then(() => {
            sendKeys(selectors.searchInput, ranStr(1,2)); // 4
            clickElem(selectors.submitInput);
        });
    --c;
    await search(c);
}

// toggle account: logout or login user
const toggleAccount = async () => {
    console.log('time to toggleAccount');
  await driver.sleep(200);
  // MOBILE START
  if (mobile) {
    clickElem(mobileSelectors.menuBttn);
    driver.sleep(700);
    await waitVisibleClick(mobileSelectors.accountBttn, 5000, 5000);
    // home
    await driver.wait(until.titleIs('Microsoft account | Home'), 2000);
    await waitVisibleClick(mobileSelectors.homeAccountBttn);
    await waitVisibleClick(mobileSelectors.homeMenuBar, 2000, 2000, mobileSelectors.homeToggleAccountBttn);
    await waitVisibleClick(mobileSelectors.signOutBttn);

    return;
  }
  // MOBILE END
  clickElem(selectors.accountBttn);

  const elem = await driver.wait(elemLocated(selectors.openAccountMenu), 1000);
  await driver.wait(elemVisible(elem), 2000);
  clickElem(selectors.toggleAccountBttn);

  const signInBttn = await driver.wait(elemLocated(selectors.accountSignInBttn), 3000);
  await driver.wait(elemVisible(signInBttn), 7000);
};

async function go(configList) {
  if (!config.length) {
    driver.quit();
    return;
  }

  const currConfig = configList.shift();

  await initLoginFlow(currConfig)
  await bingFlow();
  await bingSearch();
  await toggleAccount();
  // await go(configList); // call function again
};

go(config);
