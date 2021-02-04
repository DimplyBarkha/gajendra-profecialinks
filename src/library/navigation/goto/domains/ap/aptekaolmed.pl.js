
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'aptekaolmed.pl',
    timeout: 200000,
    country: 'SE',
    store: 'aptekaolmed',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { firstRequestTimeout: 60000, timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
