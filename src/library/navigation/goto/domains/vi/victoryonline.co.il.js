
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'victoryonline.co.il',
    timeout: 20000,
    country: 'IL',
    store: 'victoryonline',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto('https://www.victoryonline.co.il/', {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'networkidle0',
      checkBlocked: false,
    });
    await context.waitForNavigation();
    await context.waitForSelector('div#HPPanel', { timeout: 30000 });
  },
};
