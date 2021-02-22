const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('ul.topic li input')) ? document.querySelectorAll('ul.topic li input').length : 1;
  });
  if (variantLength > 1) {
    await context.evaluate(async () => {
      const skuDiv = document.createElement('div');
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);

      const availabilityTextDiv = document.createElement('div');
      availabilityTextDiv.id = 'availabilityText';
      document.body.appendChild(availabilityTextDiv);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        document.querySelectorAll('ul.topic li label')[j].click();
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        var sku = '';
        if (document.querySelectorAll('meta[itemprop="sku"]')[j]) {
          sku = document.querySelectorAll('meta[itemprop="sku"]')[j].getAttribute('content');
        } else {
          sku = document.querySelector('#___rc-p-sku-ids').getAttribute('value');
        }
        document.querySelector('#selectedSKU').setAttribute('data-sku', sku);
        var availabilityText = document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]')[j];
        if (availabilityText) {
          document.querySelector('#availabilityText').setAttribute('data-availability', availabilityText.getAttribute('href'));
        }
        return true;
      }, j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  } else {
    await context.evaluate(async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      const skuDiv = document.createElement('div');
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);
      const availabilityTextDiv = document.createElement('div');
      availabilityTextDiv.id = 'availabilityText';
      document.body.appendChild(availabilityTextDiv);
      var sku = '';
      if (document.querySelector('meta[itemprop="sku"]')) {
        sku = document.querySelector('meta[itemprop="sku"]').getAttribute('content');
      } else {
        sku = document.querySelector('#___rc-p-sku-ids').getAttribute('value');
      }
      document.querySelector('#selectedSKU').setAttribute('data-sku', sku);
      var availabilityText = document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]')[0];
      if (availabilityText) {
        document.querySelector('#availabilityText').setAttribute('data-availability', availabilityText.getAttribute('href'));
      }
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
