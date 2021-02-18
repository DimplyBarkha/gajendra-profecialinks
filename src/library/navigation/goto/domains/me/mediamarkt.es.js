// const { implementation } = require('./mediamarkt.com.tr');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.es',
    timeout: 80000,
    store: 'mediamarkt',
    country: 'ES',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId, id },
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
    // url = `https://www.mediamarkt.es/es/product/-${id}.html` + '#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]';
    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      load_all_resources: true,
      images_enabled: true,
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
