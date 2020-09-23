module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'tatacliq.com',
    timeout: 50000,
    country: 'IN',
    store: 'tatacliq',
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
