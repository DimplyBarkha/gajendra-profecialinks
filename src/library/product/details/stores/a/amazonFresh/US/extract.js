const { transform } = require('./transform');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
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
        context.setInputValue(localeInput, '90210'),
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

  async function getVariants () {
    const variants = await context.evaluate(function () {
      const variantList = [];
      const variantCards = document.querySelectorAll('li[data-defaultasin]');
      const variantDropdown = document.querySelectorAll('[id*="variation"] option');
      const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');
      // const parentVariant = document.evaluate("//script[contains(@type,'a-state') and contains(text(), 'parentAsin')]", document, null, XPathResult.ANY_TYPE, null) ? document.evaluate("//script[contains(@type,'a-state') and contains(text(), 'parentAsin')]", document, null, XPathResult.ANY_TYPE, null).iterateNext() : null;
      // if(parentVariant){
      //   const regex = /parentAsin\"\:\"([A-Za-z0-9]{10,})/s;
      //   let vasinRaw = parentVariant.innerText;
      //   const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
      //   if(vasin !== ''){
      //     variantList.push(vasin);
      //     }
      // }
      if (variantBooks) {
        for (let i = 0; i < variantBooks.length; i++) {
          const element = variantBooks[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('href');
          if (vasinRaw !== '') {
            const regex = /\/dp\/([A-Za-z0-9]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantDropdown) {
        for (let i = 0; i < variantDropdown.length; i++) {
          const element = variantDropdown[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('value');
          if (vasinRaw !== '') {
            const regex = /[0-9]{1,},([0-9a-zA-Z]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantCards) {
        for (let i = 0; i < variantCards.length; i++) {
          const element = variantCards[i];
          if (element == null) {
            continue;
          }
          const vasin = element.getAttribute('data-defaultasin');
          if (vasin !== '') {
            variantList.push(vasin);
          }
        }
      }
      return variantList;
    });
    return variants;
  };

  async function addUrl () {
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
  }

  // await setLocale();
  // @ts-ignore

  await new Promise(resolve => setTimeout(resolve, 5000));
  await setLocale();
  console.log('getting variants');
  const allVariants = [...new Set(await getVariants())];
  await new Promise(resolve => setTimeout(resolve, 5000));
  await loadAllResources();
  const productID = inputs.id;
  await context.evaluate(addUrl);
  console.log('autoscroll end');
  await context.extract(productDetails, { transform, type: 'APPEND' });

  console.log('#### of Variants:', allVariants.length);
  console.log('#### Variants:', allVariants);
  for (let i = 0; i < allVariants.length; i++) {
    const id = allVariants[i];
    if (id === productID) {
      continue;
    }
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });
    await new Promise(resolve => setTimeout(resolve, 4000));
    await setLocale();
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (allVariants.length >= 5) {
      await loadAllResources(10000);
    } else {
      await loadAllResources();
    }
    console.log('autoscroll end');
    await context.evaluate(addUrl);
    // await new Promise(resolve => setTimeout(resolve, 2000));
    await context.extract(productDetails, { transform, type: 'APPEND' });
    const pageVariants = await getVariants();
    console.log('#### of Variants:', allVariants.length);
    console.log('#### Variants:', allVariants);
    for (let j = 0; j < pageVariants.length; j++) {
      const pageVariant = pageVariants[j];
      if (allVariants.indexOf(pageVariant) === -1) {
        allVariants.push(pageVariant);
        console.log('new variant: ' + pageVariant);
        console.log(allVariants);
      }
    }
  }

  // return await context.extract(productDetails, { transform });
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