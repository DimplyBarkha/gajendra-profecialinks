const { transform } = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    transform,
    domain: 'apoteket.se',
    zipcode: '',
  },
  implementation
};

async function implementation(
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  let list = await context.evaluate(() => !document.querySelector('div[class="product-grid__items"]'))
  if (!list) {
    async function firstItemLink() {
      return await context.evaluate(function () {
        let firstItem = document.querySelector('div.grid-product__content.grid-item__content a')
        // @ts-ignore
        firstItem = firstItem ? firstItem.href : '';
        let finalLink
        // @ts-ignore
        if (firstItem.includes('http') & firstItem !== '') {
          finalLink = firstItem
          // @ts-ignore
        } else if (firstItem !== '') {
          finalLink = 'https://www.apoteket.se' + firstItem;
        }
        return finalLink;
      });
    }
    const url = await firstItemLink();
    if (url !== null) {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
    await context.waitForNavigation();
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  await context.evaluate(async (parentInput) => {

    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function findJsonObj(scriptSelector) {
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
    let gtin = JSONObj ? JSONObj.gtin13 : '';
    addElementToDocument('bb_gtin', gtin);
    let productId = JSONObj ? JSONObj.productId : '';
    addElementToDocument('bb_productId', productId);
    let sku = JSONObj ? JSONObj.sku : '';
    addElementToDocument('bb_sku', sku);
    // let description = JSONObj ? JSONObj.description : '';
    // addElementToDocument('bb_description', description);
    let descArr = [];
let descElement1;
let description1 = document.querySelector('div.product-page-info');
descElement1 = description1 ? description1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').replace(/\&nbsp;/gm, '').trim() : '';
if(description1){
  descArr.push(descElement1);
  console.log('descElement1: ', descElement1);
}
let descElement2;
let description2 = document.querySelector('div[data-tab-heading="Beskrivning"]');
descElement2 = description2 ? description2.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').replace(/\&nbsp;/gm, '').trim() : '';
if(description2){
  descArr.push(descElement2);
  console.log('descElement2: ', descElement2);
}
if(descArr){
  let finalDes = descArr.join(' ');
  addElementToDocument('bb_description', finalDes);
  console.log('finalDes: ', finalDes);
}
  });
  return await context.extract(productDetails, { transform });
}
