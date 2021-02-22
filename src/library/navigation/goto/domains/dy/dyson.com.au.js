
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.com.au',
    timeout: 40000,
    country: 'AU',
    store: 'dyson',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 40000;
    await context.goto(url.replace('%20', '%2B'), { timeout: timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
