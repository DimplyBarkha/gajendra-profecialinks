
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'colruyt.be',
    timeout: 90000,
    country: 'BE',
    store: 'colruyt_nl',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('button#onetrust-accept-btn-handler');
      await context.click('button#onetrust-accept-btn-handler');
    } catch (error) {
      console.log('Cookie button click fail');
    }
    try {
      await context.waitForSelector('#features-modal  div.overlay__continue > button');
      await context.click('#features-modal  div.overlay__continue > button');
    } catch (error) {
      console.log('Next Cookie button click fail');
    }

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
