module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.com.tr',
    timeout: 50000,
    store: 'mediamarkt',
    country: 'TR',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
    });
    // For mediamarkt ES
    try {
      await context.waitForSelector('.gdpr-cookie-layer--show');
      await context.click('button[class*="btn--submit--all"]');
    } catch (e) {
      console.log('No cookie box present.');
    }
  },
};
