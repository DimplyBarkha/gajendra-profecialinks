module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'footlocker.co.uk',
    country: 'UK',
    store: 'footlocker',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
