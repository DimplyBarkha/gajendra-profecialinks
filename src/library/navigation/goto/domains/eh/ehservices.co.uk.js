module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jbhifi.com.au',
    timeout: 20000,
    country: 'AU',
    store: 'jbhifi',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const result = await context.evaluate((currentUrl) => {
      return currentUrl.search('/d/');
    }, url);
    if (result > 0) {
      await context.setBlockAds(false);
      await context.setLoadAllResources(true);
      await context.setLoadImages(true);
      await context.setJavaScriptEnabled(true);
    }
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
