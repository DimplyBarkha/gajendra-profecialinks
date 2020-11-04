const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(function () {
    try {
      const overlay = document.querySelector('div#coiOverlay:not([style*="none"])');
      const form = document.querySelector('div#coiOverlay:not([style*="none"]) button.coi-banner__accept[aria-label*="JAG"]');
      if (form) {
        form.click();
      }
    } catch (error) {
      console.log('cookie pop up not loded', error);
    }
  });

  try {
    await context.waitForSelector('div#searchProductsInfo a.product-image-link');
  } catch (error) {
    console.log('error: ', error);
  }
  let list = await context.evaluate(() => !document.querySelector('div#searchProductsInfo a.product-image-link'))
  if (!list) {
    async function firstItemLink() {
      return await context.evaluate(function () {
        let firstItem = document.querySelector('div#searchProductsInfo a.product-image-link')
        // @ts-ignore
        firstItem = firstItem ? firstItem.href : '';
        let finalLink
        // @ts-ignore
        // if (firstItem.includes('http') & firstItem !== '') {
        //   finalLink = firstItem
        //   // @ts-ignore
        // } else if (firstItem !== '') {
        //   finalLink = 'https://www.apoteket.se' + firstItem;
        // }
        return firstItem;
      });
    }
    const url = await firstItemLink();
    console.log('url is $$$$$$$$$$$$$$$$$$$$$', url);
    if (url !== null) {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
    await context.waitForNavigation();
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 8000))
  //-------------------------
  await context.evaluate(async (parentInput) => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function findJsonObj () {
      try {
        const xpath = `//script[contains(.,'sku')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
   let JSONObj = await findJsonObj();
   console.log('JSONObj: ', JSONObj);
   let url = JSONObj ? JSONObj.url : '';
   let variant = document.querySelectorAll('select#variants option');
   console.log('variant:++++++++++++++++++++ ', variant);
   if(variant.length === 0){
    let bodyId = document.querySelector('head');
    console.log('bodyId: ', bodyId);
    if(bodyId){
      bodyId.setAttribute("id", "customId")
    }
   }
   console.log('url: ', url);
    addElementToDocument('bb_url',url);
    });
  return await context.extract(variants, { transform });
  }
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { createUrl, variants } = dependencies;
//   console.log('variant code called now ################');
//   await context.evaluate(function () {
//     try {
//       const overlay = document.querySelector('div#coiOverlay:not([style*="none"])');
//       const form = document.querySelector('div#coiOverlay:not([style*="none"]) button.coi-banner__accept[aria-label*="JAG"]');
//       if (form) {
//         form.click();
//       }
//     } catch (error) {
//       console.log('cookie pop up not loded', error);
//     }
//     try {
//       const firstItem = document.querySelector('a.product-image-link');
//       if (firstItem) {
//         firstItem.click();
//       }
//     } catch (err) {}
//   }, createUrl);
//   return await context.extract(variants);
// }
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform: transform,
    domain: 'elgiganten.se',
    zipcode: '',
  },
  implementation,
};
