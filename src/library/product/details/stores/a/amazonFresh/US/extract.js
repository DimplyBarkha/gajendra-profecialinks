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

  async function autoScroll () {
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight * 0.20;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
      if (document.querySelector('div.askDetailPageSearchWidgetSection')) {
        document.querySelector('div.askDetailPageSearchWidgetSection').scrollIntoView();
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
      // let scrollTop = 0;
      // while (scrollTop <= 20000) {
      //   await stall(500);
      //   scrollTop += 1000;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 20000) {
      //     await stall(8000);
      //     break;
      //   }
      // }
      // function stall (ms) {
      //   return new Promise(resolve => {
      //     setTimeout(() => {
      //       resolve();
      //     }, ms);
      //   });
      // }
    });
  }

  const loadManufacturerSelectors = async () => (document.querySelector('div#dpx-aplus-product-description_feature_div') !== null) || (document.querySelector('div#aplus_feature_div div#aplus') !== null);
  const loadImportantInfoSelectors = async () => (document.querySelector('div#dpx-default-important-information_feature_div div#importantInformation_feature_div') !== null);

  async function loadAllResources () {
    const loadManufacturer = await context.evaluate(loadManufacturerSelectors);
    console.log('loadManufacturer');
    console.log(loadManufacturer);
    if (loadManufacturer) {
      console.log('in here waiting for aplus-v2');
      try {
        await context.waitForSelector('div.aplus-v2', { timeout: 70000 });
      } catch (err) {
        // throw new Error('Not able to find div.aplus-v2')
        console.log('Could not load div.aplus-v2');
      }
    }

    const loadImportantInfo = await context.evaluate(loadImportantInfoSelectors);
    console.log('loadImportantInfo');
    console.log(loadImportantInfo);
    if (loadImportantInfo) {
      console.log('in here waiting for important-information');
      try {
        await context.waitForSelector('div#important-information', { timeout: 70000 });
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
      return await context.evaluate(function () {
        if (document.querySelector('div#nav-global-location-slot')) {
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
  await context.evaluate(addUrl);
  console.log('getting variants');
  const allVariants = [...new Set(await getVariants())];
  console.log('autoscroll');
  await setLocale();
  await autoScroll();
  await new Promise(resolve => setTimeout(resolve, 7000));
  await loadAllResources();
  console.log('autoscroll end');
  await context.extract(productDetails, { transform, type: 'APPEND' });
  console.log('#### of Variants:', allVariants.length);
  console.log('#### Variants:', allVariants);
  // console.log('autoscroll');
  // await setLocale();
  // await autoScroll();
  // await new Promise(resolve => setTimeout(resolve, 5000));
  // await loadAllResources();
  // console.log('autoscroll end');
  for (let i = 0; i < allVariants.length; i++) {
    const id = allVariants[i];
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('autoscroll');
    await setLocale();
    await autoScroll();
    await new Promise(resolve => setTimeout(resolve, 7000));
    await loadAllResources();
    console.log('autoscroll end');
    await context.evaluate(addUrl);
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
