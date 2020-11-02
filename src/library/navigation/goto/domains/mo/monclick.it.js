
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'monclick.it',
    timeout: null,
    country: 'IT',
    store: 'monclick',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    try{
      await context.waitForSelector('section.mk-product-page')
    }catch(err){
      console.log('product page did not load')
    }
  },
};
