const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails, Helpers, SharedHelpers }) => {
    // const sharedhelpers = new SharedHelpers(context);

    // const priceValue = await context.evaluate(async function () {
    //   const priceEle = 'meta[property*="product:price:amount"]';
    //   let price = document.querySelectorAll(priceEle) && document.querySelectorAll(priceEle)[0] && document.querySelectorAll(priceEle)[0].hasAttribute('content') ? document.querySelectorAll(priceEle)[0].getAttribute('content') : '';
    //   price = price.replace('.', ',');
    //   return price;
    // });

    // await sharedhelpers.addHiddenInfo('priceValue', priceValue);
    
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    return await context.extract(productDetails, { transform });
  },
};
