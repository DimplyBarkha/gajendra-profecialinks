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

  async function setLocale () {
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
    const openNewLocaleModalBtn = await openNewLocaleModalBtnCheck()
    if(openNewLocaleModalBtn !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(openNewLocaleModalBtn)
      ]);
    };
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
        context.setInputValue(localeInput, "10001")
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

  await setLocale();
  // @ts-ignore
  const allVariants = [...new Set(await getVariants())];
  await context.evaluate(addUrl);
  console.log('getting variants');
  await context.extract(productDetails, { transform, type: 'APPEND' });
  console.log('#### of Variants:', allVariants.length);
  console.log('#### Variants:', allVariants);
  for (let i = 0; i < allVariants.length; i++) {
    const id = allVariants[i];
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });
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
