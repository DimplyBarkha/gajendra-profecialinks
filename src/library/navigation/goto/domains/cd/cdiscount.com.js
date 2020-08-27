
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cdiscount.com',
    timeout: 60000,
    country: 'FR',
    store: 'cdiscount',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, js_enabled: true, css_enabled: false, random_move_mouse: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
