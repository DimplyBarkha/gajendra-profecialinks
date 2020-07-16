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
          var scrollHeight = document.body.scrollHeight*.45;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
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


  async function setLocale () {
  //-- Functions to check if buttons exist --//
    async function localeWarningCheck () {
      return await context.evaluate(function () {
        const localeEl = document.evaluate("//div[contains(@id, 'glow-toaster-body') and //*[contains(text(), 'Amazon Fresh')]]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const button = 'div.glow-toaster-footer input[data-action-type=DISMISS]';
        if (!!document.querySelector(button) && localeEl.snapshotLength > 0){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function additionalConfirmCheck () {
      return await context.evaluate(function () {
        const button = '.a-popover-footer input#GLUXConfirmClose';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function openNewLocaleModalBtnCheck () {
      console.log('openNewLocaleModalBtnCheck() in  progress')
      return await context.evaluate(function () {
        const button = '#nav-global-location-slot a';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function changeLocaleBtnCheck () {
      console.log('changeLocaleBtnCheck() in  progress')
      return await context.evaluate(function () {
        const button = 'a[id*="ChangePostalCodeLink"]';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function localeInputCheck () {
      console.log('localeInputCheck')
      return await context.evaluate(function () {
        const input = 'input[data-action*=PostalInputAction]';
        if (!!document.querySelector(input)){
          return input
        }
        else{
          return 'false';
        }
      });
    }
    async function setNewLocalBtnCheck () {
      console.log('setNewLocalBtnCheck() in  progress')
      return await context.evaluate(function () {
        const button = '[data-action*="GLUXPostalUpdateAction"] input';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function setNewLocalDoneCheck () {
      console.log('setNewLocalDoneCheck() in  progress')
      return await context.evaluate(function () {
        const button = 'button[name=glowDoneButton]';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }

  //-- Actions to click existing buttons needed to set  locale --//
    let openNewLocaleWarnBtn = await localeWarningCheck()
    let additionalChecks = 0
    if(openNewLocaleWarnBtn !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(openNewLocaleWarnBtn)
      ]);
      additionalChecks += 1;
    }
    await new Promise(r => setTimeout(r, 5000));
    const openNewLocaleModalBtn = await openNewLocaleModalBtnCheck()
    openNewLocaleWarnBtn = await localeWarningCheck()
    if(openNewLocaleModalBtn !== 'false' && await localeWarningCheck() === 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(openNewLocaleModalBtn)
      ]);
    }
    const changeLocaleBtn = await changeLocaleBtnCheck()
    if(changeLocaleBtn !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(changeLocaleBtn)
      ]);    
    }
    await new Promise(r => setTimeout(r, 2000));
    const localeInput = await localeInputCheck()
    if(localeInput !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.setInputValue(localeInput, "90210")
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    const setNewLocalBtn = await setNewLocalBtnCheck()
    if(setNewLocalBtn !== 'false'){
      const [response] = await Promise.all([
        // context.waitForMutuation('#GLUXZipConfirmationSection', { timeout: 5000 }),
        context.waitForNavigation({ timeout: 20000 }),
        context.click(setNewLocalBtn)
      ]);
    }
    const setNewLocalDone = await setNewLocalDoneCheck()
    if(setNewLocalDone !== 'false'){
      console.log('here')
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(setNewLocalDone)
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    if(additionalChecks>0){
      if(openNewLocaleModalBtn !== 'false' && await localeWarningCheck() === 'false'){
        const [response] = await Promise.all([
          context.waitForNavigation({ timeout: 20000 }),
          context.click(openNewLocaleModalBtn)
        ]);
      }
      await new Promise(r => setTimeout(r, 2000));
      const finalConfirmBtn = await additionalConfirmCheck()
      if(finalConfirmBtn  !== 'false'){
        console.log('here')
        const [response] = await Promise.all([
          context.waitForNavigation({ timeout: 20000 }),
          context.click(finalConfirmBtn)
        ]);
      }
    }
    await new Promise(r => setTimeout(r, 5000));
    return
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
            if(vasin !== ''){
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
            if(vasin !== ''){
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
          if (vasin !== ''){
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
    let url = window.location.href;
    const splits = url ? url.split('/') : [];
    let asinRaw = (splits.length > 0) ? splits[splits.length - 2] : '';
    addHiddenDiv('added-url', url);
    addHiddenDiv('added-asin', asinRaw);
  }

  const loadProductInformationSelectors = async () => (document.querySelectorAll('div#pageRefreshJsInitializer_feature_div script') && document.querySelectorAll('div#pageRefreshJsInitializer_feature_div script')[1]) ? document.querySelectorAll('div#pageRefreshJsInitializer_feature_div script')[1].textContent.includes('"importantInformation":{"divToUpdate":"importantInformation_feature_div"}') : false;
  const loadManufacturerSelectors = async () => (document.querySelectorAll('div#pageRefreshJsInitializer_feature_div script') && document.querySelectorAll('div#pageRefreshJsInitializer_feature_div script')[1]) ? document.querySelectorAll('div#pageRefreshJsInitializer_feature_div script')[1].textContent.includes('"aplus":{"divToUpdate":"aplus_feature_div"}') : false;
  const loadScriptInfoSelectors = async () => (document.querySelectorAll('div#pageRefreshJsInitializer_feature_div').length !== 0);

  async function loadAllResources() {
    const loadScriptInfo = await context.evaluate(loadScriptInfoSelectors);
    console.log('loadScriptInfo')
    console.log(loadScriptInfo)
    if (loadScriptInfo) {
      console.log('in here waiting for loadScriptInfo');
      try {
        await context.waitForSelector('div#pageRefreshJsInitializer_feature_div script')
        console.log('we did it!')
      } catch (err) {
        await new Promise(resolve => setTimeout(resolve, 6000));
        let ErrMsg = await context.evaluate((sel) => {
          let element = document.querySelector(sel);
          return element? element.innerHTML: null;
      },'div#pageRefreshJsInitializer_feature_div script');
        if (ErrMsg) {
          console.log('yay');
        } else {
          throw new Error('Not able to find script')
        }
      }
    }
    const loadProductInfo = await context.evaluate(loadProductInformationSelectors);
    console.log('loadProductInfo')
    console.log(loadProductInfo)
    if (loadProductInfo) {
      console.log('in here waiting for importantInformation_feature_div')
      try {
        await context.waitForSelector('div#importantInformation_feature_div')
        console.log('we did it importantInformation_feature_div!')
      } catch (err) {
        await new Promise(resolve => setTimeout(resolve, 6000));
        let ErrMsg = await context.evaluate((sel) => {
          let element = document.querySelector(sel);
          return element? element.innerHTML: null;
      },'div#importantInformation_feature_div');
        if (ErrMsg) {
          console.log('yay importantInformation_feature_div');
        } else {
          throw new Error('Not able to find div#importantInformation_feature_div')
        }
      }
      // await context.waitForSelector('div#importantInformation_feature_div');
    }
    await new Promise(resolve => setTimeout(resolve, 6000));
    const loadManufacturer = await context.evaluate(loadManufacturerSelectors);
    console.log('loadManufacturer')
    console.log(loadManufacturer)
    if (loadManufacturer) {
      console.log('in here waiting for aplus_feature_div');
      try {
        await context.waitForSelector('div#aplus_feature_div')
        console.log('we did it div#aplus_feature_div!')
      } catch (err) {
        console.log('autoscroll');
        await autoScroll();
        console.log('autoscroll end');
        await new Promise(resolve => setTimeout(resolve, 8000));
        let ErrMsg = await context.evaluate((sel) => {
          let element = document.querySelector(sel);
          return element? element.innerHTML: null;
      },'div#aplus_feature_div');
        if (ErrMsg) {
          console.log('yay div#aplus_feature_div');
        } else {
          throw new Error('Not able to find div#aplus_feature_div')
        }
      }
      try {
        await context.waitForSelector('div.aplus-v2')
        console.log('we did it div.aplus-v2!')
      } catch (err) {
        console.log('autoscroll');
        await autoScroll();
        console.log('autoscroll end');
        await new Promise(resolve => setTimeout(resolve, 8000));
        let ErrMsg = await context.evaluate((sel) => {
          let element = document.querySelector(sel);
          return element? element.innerHTML: null;
      },'div.aplus-v2');
        if (ErrMsg) {
          console.log('yay div.aplus-v2');
        } else {
          throw new Error('No able to find div.aplus-v2')
        }
      }
      // await context.waitForSelector('div#aplus_feature_div');
      // await context.waitForSelector('div.aplus-v2');
    }
  }
  // await setLocale();
  // @ts-ignore
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  // await loadAllResources();
  await context.evaluate(addUrl);
  console.log('getting variants');
  const allVariants = [...new Set(await getVariants())];
  console.log('autoscroll');
  await autoScroll();
  console.log('autoscroll end');
  await context.extract(productDetails, { transform, type: 'APPEND' });
  console.log('#### of Variants:', allVariants.length);
  console.log('#### Variants:', allVariants);
  console.log('autoscroll');
  await autoScroll();
  console.log('autoscroll end');
  for (let i = 0; i < allVariants.length; i++) {
    const id = allVariants[i];
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('autoscroll');
    await autoScroll();
    console.log('autoscroll end');
    // await loadAllResources();
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
