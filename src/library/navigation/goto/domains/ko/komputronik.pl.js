
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'komputronik.pl',
    timeout: 120000,
    country: 'PL',
    store: 'komputronik',
    zipcode: "''",
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
