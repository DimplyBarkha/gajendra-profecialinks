
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'UK',
    domain: 'euronics.co.uk',
    store: 'euronics',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    await context.goto(`${url}`, {
      timeout: timeout,
      anti_fingerprint: true,
      discard_CSP_header: false,
    });
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
