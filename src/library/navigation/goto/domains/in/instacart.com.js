
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'instacart.com',
    timeout: 50000,
    country: 'US',
    store: 'instacart',
    zipcode: '',
  },

  implementation: async ({ url, zipcode, storeId }, parameterValues, context, dependencies) => {
    await context.stop();
    const inputUrl = `${url}/store/${storeId}`;
    await context.goto(inputUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: false });

    if (zipcode) {
      await dependencies.setZipCode({ zipcode: zipcode });
    }
  },
};
