module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    timeout: 50000,
    zipcode: '95825',
    store: 'totalwine_95825',
    country: 'US',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setFirstRequestTimeout(90000);
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setUseRelayProxy(false);
    if (zipcode) {
      url = `${url}#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~1108:ifcStore~${zipcode}@ifcStoreState~US-CA@method~INSTORE_PICKUP"}]}[/!opt!]`;
    }
    await context.goto(url);
    // await context.waitForSelector('article[class="info__1tmaekGO"] > h2', { timeout: 30000 });
  },
};
