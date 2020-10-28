const { transform } = require('../shared')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    transform,
    domain: 'apoteket.se',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  try {
    await context.waitForSelector('div.product-grid__items div.grid-item');
  } catch (error) {
    console.log('error: ', error);
  }
  async function firstItemLink () {
    return await context.evaluate(function () {
      let firstItem = document.querySelector('div.grid-product__content.grid-item__content a')
      // @ts-ignore
      firstItem = firstItem ? firstItem.href : '';
      let finalLink
      // @ts-ignore
      if(firstItem.includes('http') & firstItem !== ''){
        finalLink = firstItem
      // @ts-ignore
      }else if(firstItem !== ''){
        finalLink = 'https://www.apoteket.se'+firstItem;
      }
      return finalLink;
    });
  }
  const url = await firstItemLink();
  if (url !== null) {
    await context.goto(url, { timeout: 90000, waitUntil: 'load', checkBlocked: true });
  }
  // await context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
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
