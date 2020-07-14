
const implementation = async (inputs, parameters, context, dependencies) => {
  console.log('hit zip changer!!');
  const { zipcode } = inputs;

  const changeZip = async (wantedZip) => {
    await context.click('span#glow-ingress-line2.nav-line-2');
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.setInputValue('input[aria-label="or enter a US zip code"]', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.click('input[aria-labelledby="GLUXZipUpdate-announce"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.click('button[name="glowDoneButton"]');
  };

  async function setLocale (zipcode) {
    // -- Functions to check if buttons exist --//
    async function localeWarningCheck () {
      return await context.evaluate(function () {
        const localeEl = document.evaluate("//div[contains(@id, 'glow-toaster-body') and //*[contains(text(), 'Amazon Fresh')]]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const button = 'div.glow-toaster-footer input[data-action-type=DISMISS]';
        if (!!document.querySelector(button) && localeEl.snapshotLength > 0) {
          return button;
        } else {
          return 'false';
        }
      });
    }
    async function additionalConfirmCheck () {
      return await context.evaluate(function () {
        const button = '.a-popover-footer input#GLUXConfirmClose';
        if (document.querySelector(button)) {
          return button;
        } else {
          return 'false';
        }
      });
    }
    async function openNewLocaleModalBtnCheck () {
      console.log('openNewLocaleModalBtnCheck() in  progress');
      return await context.evaluate(function () {
        const button = '#nav-global-location-slot a';
        if (document.querySelector(button)) {
          return button;
        } else {
          return 'false';
        }
      });
    }
    async function changeLocaleBtnCheck () {
      console.log('changeLocaleBtnCheck() in  progress');
      return await context.evaluate(function () {
        const button = 'a[id*="ChangePostalCodeLink"]';
        if (document.querySelector(button)) {
          return button;
        } else {
          return 'false';
        }
      });
    }
    async function localeInputCheck () {
      console.log('localeInputCheck');
      return await context.evaluate(function () {
        const input = 'input[data-action*=PostalInputAction]';
        if (document.querySelector(input)) {
          return input;
        } else {
          return 'false';
        }
      });
    }
    async function setNewLocalBtnCheck () {
      console.log('setNewLocalBtnCheck() in  progress');
      return await context.evaluate(function () {
        const button = '[data-action*="GLUXPostalUpdateAction"] input';
        if (document.querySelector(button)) {
          return button;
        } else {
          return 'false';
        }
      });
    }
    async function setNewLocalDoneCheck () {
      console.log('setNewLocalDoneCheck() in  progress');
      return await context.evaluate(function () {
        const button = 'button[name=glowDoneButton]';
        if (document.querySelector(button)) {
          return button;
        } else {
          return 'false';
        }
      });
    }

    // -- Actions to click existing buttons needed to set  locale --//
    let openNewLocaleWarnBtn = await localeWarningCheck();
    let additionalChecks = 0;
    if (openNewLocaleWarnBtn !== 'false') {
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(openNewLocaleWarnBtn),
      ]);
      additionalChecks += 1;
    }
    await new Promise(r => setTimeout(r, 5000));
    const openNewLocaleModalBtn = await openNewLocaleModalBtnCheck();
    openNewLocaleWarnBtn = await localeWarningCheck();
    if (openNewLocaleModalBtn !== 'false' && await localeWarningCheck() === 'false') {
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(openNewLocaleModalBtn),
      ]);
    }
    const changeLocaleBtn = await changeLocaleBtnCheck();
    if (changeLocaleBtn !== 'false') {
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(changeLocaleBtn),
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    const localeInput = await localeInputCheck();
    if (localeInput !== 'false') {
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.setInputValue(localeInput, zipcode),
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    const setNewLocalBtn = await setNewLocalBtnCheck();
    if (setNewLocalBtn !== 'false') {
      const [response] = await Promise.all([
        // context.waitForMutuation('#GLUXZipConfirmationSection', { timeout: 5000 }),
        context.waitForNavigation({ timeout: 20000 }),
        context.click(setNewLocalBtn),
      ]);
    }
    const setNewLocalDone = await setNewLocalDoneCheck();
    if (setNewLocalDone !== 'false') {
      console.log('here');
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(setNewLocalDone),
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    if (additionalChecks > 0) {
      if (openNewLocaleModalBtn !== 'false' && await localeWarningCheck() === 'false') {
        const [response] = await Promise.all([
          context.waitForNavigation({ timeout: 20000 }),
          context.click(openNewLocaleModalBtn),
        ]);
      }
      await new Promise(r => setTimeout(r, 2000));
      const finalConfirmBtn = await additionalConfirmCheck();
      if (finalConfirmBtn !== 'false') {
        console.log('here');
        const [response] = await Promise.all([
          context.waitForNavigation({ timeout: 20000 }),
          context.click(finalConfirmBtn),
        ]);
      }
    }
    await new Promise(r => setTimeout(r, 5000));
  }

  try {
    // await changeZip(zipcode);
    await setLocale(zipcode);
  } catch (exception) {
    console.log('Failed to change zipcode..!');
  }
};

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    // store: 'amazonApparel',
    store: 'amazonFresh',
    zipcode: '90210',
  },
  implementation,
};
