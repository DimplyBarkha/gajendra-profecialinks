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
  if (variantLength > 1) {
    // await preparePageForCommonElement(0, variantLength);
    await context.evaluate(async () => {
      const skuDiv = document.createElement('div');
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);
    });
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        const sku = document.querySelectorAll('meta[itemprop="sku"]')[j].getAttribute('content');
        console.log('sku====>', sku);
        document.querySelector('#selectedSKU').setAttribute('data-sku', sku);
        return document.querySelectorAll('ul.topic li label')[j].click();
      }, j);
      // await context.click(`ul.topic li label`);
      console.log('Inside variants', j);
      // await preparePage(j, variantLength);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  } else {
    await context.evaluate(async () => {
      const skuDiv = document.createElement('div');
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);
      const sku = document.querySelector('meta[itemprop="sku"]').getAttribute('content');
      console.log('sku====>', sku);
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
