
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'colruyt.be',
    timeout: 50000,
    country: 'BE',
    store: 'colruyt',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
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

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
