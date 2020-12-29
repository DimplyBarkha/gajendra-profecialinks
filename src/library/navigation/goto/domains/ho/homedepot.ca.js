
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'homedepot.ca',
    timeout: 50000,
    country: 'CA',
    store: 'homedepot',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.click('localization-confirmation div:nth-child(1)>button');
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      console.log('no localized button found');
    }
  },
};
