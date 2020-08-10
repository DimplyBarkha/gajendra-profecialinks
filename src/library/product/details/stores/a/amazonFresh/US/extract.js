const { transform } = require('./transform');
/**
 *
 * @param { { url?: string,  id?: string, parentInput?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

async function implementation (
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const loadManufacturerSelectors = async () => ((document.querySelector('div#dpx-aplus-product-description_feature_div') !== null) || (document.querySelector('div#aplus_feature_div div#aplus') !== null));
  const loadImportantInfoSelectors = async () => ((document.querySelector('div#dpx-default-important-information_feature_div div#importantInformation_feature_div') !== null));

  async function loadAllResources (timeout = 40000) {
    const loadManufacturer = await context.evaluate(loadManufacturerSelectors);
    console.log('loadManufacturer');
    let shouldLoadAplusBody = false;
    if (loadManufacturer) {
      console.log('in here waiting for div#aplus_feature_div div#aplus');
      try {
        await context.waitForSelector('div#aplus_feature_div div#aplus', { timeout: timeout });
        shouldLoadAplusBody = true;
      } catch (err) {
        // throw new Error('Not able to find div.aplus-v2')
        console.log('Could not load div#aplus_feature_div div#aplus');
      }
      console.log('in here waiting for aplus-v2');
      if (shouldLoadAplusBody) {
        try {
          await context.waitForSelector('div.aplus-v2', { timeout: timeout });
        } catch (err) {
          console.log('Could not load div.aplus-v2');
        }
      }
    }

    const loadImportantInfo = await context.evaluate(loadImportantInfoSelectors);
    console.log('loadImportantInfo');
    if (loadImportantInfo) {
      console.log('in here waiting for important-information');
      try {
        await context.waitForSelector('div#important-information', { timeout: 5000 });
      } catch (err) {
        // throw new Error('Not able to find div#important-information')
        console.log('Could not load div#important-information');
      }
    }
  }

  async function setLocale () {
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
    async function checkAddress () {
      console.log('checkAddress() in  progress');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await context.evaluate(function () {
        console.log(document.querySelector('div#nav-global-location-slot'));
        if (document.querySelector('div#nav-global-location-slot')) {
          console.log(document.querySelector('div#nav-global-location-slot').innerText);
          return document.querySelector('div#nav-global-location-slot').innerText.includes('90210') !== false;
        }
        return false;
      });
    }

    const shouldChangeAddress = await checkAddress();

    if (shouldChangeAddress === true) {
      return;
    }

    const changeZip = async (wantedZip) => {
      await context.click('span#glow-ingress-line2.nav-line-2');
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));

      await context.setInputValue('input[aria-label="or enter a US zip code"]', wantedZip);
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));

      await context.click('input[aria-labelledby="GLUXZipUpdate-announce"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));

      await context.click('button[name="glowDoneButton"]');
    };

    try {
      await changeZip('90210');
    } catch (exception) {
      throw new Error('Failed to update zipcode!');
    }

    // -- Actions to click existing buttons needed to set  locale --//
    // let openNewLocaleWarnBtn = await localeWarningCheck();
    // let additionalChecks = 0;
    // if (openNewLocaleWarnBtn !== 'false') {
    //   const [response] = await Promise.all([
    //     context.waitForNavigation({ timeout: 20000 }),
    //     context.click(openNewLocaleWarnBtn),
    //   ]);
    //   additionalChecks += 1;
    // }
    // await new Promise(r => setTimeout(r, 5000));
    // const openNewLocaleModalBtn = await openNewLocaleModalBtnCheck();
    // openNewLocaleWarnBtn = await localeWarningCheck();
    // if (openNewLocaleModalBtn !== 'false' && await localeWarningCheck() === 'false') {
    //   const [response] = await Promise.all([
    //     context.waitForNavigation({ timeout: 20000 }),
    //     context.click(openNewLocaleModalBtn),
    //   ]);
    // }
    // const changeLocaleBtn = await changeLocaleBtnCheck();
    // if (changeLocaleBtn !== 'false') {
    //   const [response] = await Promise.all([
    //     context.waitForNavigation({ timeout: 20000 }),
    //     context.click(changeLocaleBtn),
    //   ]);
    // }
    // await new Promise(r => setTimeout(r, 2000));
    // const localeInput = await localeInputCheck();
    // if (localeInput !== 'false') {
    //   const [response] = await Promise.all([
    //     context.waitForNavigation({ timeout: 20000 }),
    //     context.setInputValue(localeInput, '90210'),
    //   ]);
    // }
    // await new Promise(r => setTimeout(r, 2000));
    // const setNewLocalBtn = await setNewLocalBtnCheck();
    // if (setNewLocalBtn !== 'false') {
    //   const [response] = await Promise.all([
    //     // context.waitForMutuation('#GLUXZipConfirmationSection', { timeout: 5000 }),
    //     context.waitForNavigation({ timeout: 20000 }),
    //     context.click(setNewLocalBtn),
    //   ]);
    // }
    // const setNewLocalDone = await setNewLocalDoneCheck();
    // if (setNewLocalDone !== 'false') {
    //   console.log('here');
    //   const [response] = await Promise.all([
    //     context.waitForNavigation({ timeout: 20000 }),
    //     context.click(setNewLocalDone),
    //   ]);
    // }
    // await new Promise(r => setTimeout(r, 2000));
    // if (additionalChecks > 0) {
    //   if (openNewLocaleModalBtn !== 'false' && await localeWarningCheck() === 'false') {
    //     const [response] = await Promise.all([
    //       context.waitForNavigation({ timeout: 20000 }),
    //       context.click(openNewLocaleModalBtn),
    //     ]);
    //   }
    //   await new Promise(r => setTimeout(r, 2000));
    //   const finalConfirmBtn = await additionalConfirmCheck();
    //   if (finalConfirmBtn !== 'false') {
    //     console.log('here');
    //     const [response] = await Promise.all([
    //       context.waitForNavigation({ timeout: 20000 }),
    //       context.click(finalConfirmBtn),
    //     ]);
    //   }
    // }
    await new Promise(r => setTimeout(r, 5000));
  }

  async function addUrl (parentInput) {
    // console.log('Parent Input');
    // console.log(parentInput);
    await context.evaluate(async function (parentInput) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      const splits = url ? url.split('/') : [];
      const asinRaw = (splits.length > 0) ? splits[splits.length - 2] : '';
      addHiddenDiv('added-url', url);
      addHiddenDiv('added-asin', asinRaw);
      let allText = '';
      [...document.querySelectorAll('div.apm-hovermodule-slides .apm-hovermodule-slides-inner')].forEach((element) => { allText += element.innerText});
      addHiddenDiv('added-enhanced-content', document.querySelector('div#aplus') ? document.querySelector('div#aplus').innerText + allText : '');
      if (parentInput) {
        addHiddenDiv('added-parentInput', parentInput);
      }
    }, parentInput);
  }

  // await setLocale();
  // @ts-ignore

  await new Promise(resolve => setTimeout(resolve, 5000));
  await setLocale();
  await context.waitForXPath('//div[@id="nav-global-location-slot"]//*[contains(text(), "90210")]');
  console.log('getting variants');
  // const allVariants = [...new Set(await getVariants())];
  // await new Promise(resolve => setTimeout(resolve, 5000));
  await loadAllResources();
  addUrl(parentInput);
  console.log('autoscroll end');

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation,
};
