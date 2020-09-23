module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'tatacliq.com',
    timeout: 90000,
    country: 'IN',
    store: 'tatacliq',
    zipcode: '',

  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
