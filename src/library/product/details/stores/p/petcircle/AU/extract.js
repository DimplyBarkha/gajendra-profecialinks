const {transform} = require('../AU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petcircle',
    transform,
    domain: 'petcircle.com.au',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = 60000;
    const redirectProductDetails = async () => {
      try {
        await context.waitForSelector('h3.product-name>a', { timeout });
      } catch (err) {
        console.log('Product with RPC didn\'t load');
      }
    };
    
    await redirectProductDetails();
    await context.clickAndWaitForNavigation('h3.product-name>a', { timeout, waitUntil: 'load' });
    
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};