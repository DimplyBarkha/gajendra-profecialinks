const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('ul.topic li input')) ? document.querySelectorAll('ul.topic li input').length : 0;
  });
  if (variantLength > 0) {
    // await preparePageForCommonElement(0, variantLength);
    // const gtinArray = await context.evaluate(async () => {
    await context.evaluate(async () => {
      const skuDiv = document.createElement('div');
      // let gtinArray = [];
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);
      // const gtin = document.createElement('div');
      // gtin.id = 'gtin-data';
      // document.body.appendChild(gtin);
      // const scriptData = document.evaluate('//script[contains(text(), "vtex.events.addData")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // if (scriptData) {
      //  gtinArray = JSON.parse(scriptData.innerText.match(/\"productEans":(.*),"skuStocks/)[1]);
      // }
      // return gtinArray;
    });

    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        const sku = document.querySelectorAll('meta[itemprop="sku"]')[j].getAttribute('content');
        document.querySelector('#selectedSKU').setAttribute('data-sku', sku);
        // document.querySelector('#gtin-data') && document.querySelector('#gtin-data').setAttribute('data-gtin', gtinArray[j]);
        return document.querySelectorAll('ul.topic li label')[j].click();
      }, j);

      // await context.click(`ul.topic li label`);
      console.log('Inside variants', j);
      // await preparePage(j, variantLength);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  } else {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      const skuDiv = document.createElement('div');
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);
      const sku = document.querySelector('meta[itemprop="sku"]').getAttribute('content');
      // const gtinValue = document.querySelector('meta[itemprop="gtin13"]').getAttribute('content');
      // document.querySelector('#gtin-data') && document.querySelector('#gtin-data').setAttribute('data-gtin', gtinValue)
      document.querySelector('#selectedSKU').setAttribute('data-sku', sku);
    });
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    transform: transform,
    domain: 'epocacosmeticos.com',
    zipcode: '',
  },
  implementation,
};
