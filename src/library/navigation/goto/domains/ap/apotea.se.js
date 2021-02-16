module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'apotea.se',
    timeout: null,
    country: 'SE',
    store: 'apotea',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    //await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setFirstRequestTimeout(100);
    //await context.setLoadImages(true);
    await context.setCssEnabled(true);
    await context.setJavaScriptEnabled(true);
    //await context.setAntiFingerprint(false);
    //await context.setUseRelayProxy(false);
    await context.goto(url, { firstRequestTimeout: 7000, timeout: timeout, waitUntil: 'load', checkBlocked: false });
    if (url.includes('x=0&y=0')) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await context.waitForSelector('div#search-products');
      } catch (error) {
        console.log("error");
      }
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await context.waitForSelector('div#product-image');
      } catch (error) {
        console.log("error");
      }
    }
    
  }
};