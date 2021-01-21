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
    await context.evaluate(async () => {
      const skuDiv = document.createElement('div');
      skuDiv.id = 'selectedSKU';
      document.body.appendChild(skuDiv);

      const availabilityTextDiv = document.createElement('div');
      availabilityTextDiv.id = 'availabilityText';
      document.body.appendChild(availabilityTextDiv);
    });

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
        var availability = '';
        console.log('===> ', document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]'));
        if (document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]')[j]) {
          availability = document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]')[j].getAttribute('href');
        }
        document.querySelector('#availabilityText').setAttribute('data-availability', availability);
        return true;
      }, j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  } else {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async () => {
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
      var availability = '';
      if (document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]')[0]) {
        availability = document.querySelectorAll('div[itemprop="offers"] link[itemprop="availability"]')[0].getAttribute('href');
      }
      document.querySelector('#availabilityText').setAttribute('data-availability', availability);
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
