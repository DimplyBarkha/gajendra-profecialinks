module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'albertsons.com',
    timeout: 50000,
    country: 'US',
    store: 'albertsons',
    zipcode: '83642',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    await new Promise(resolve => { setTimeout(resolve, 50000); });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
