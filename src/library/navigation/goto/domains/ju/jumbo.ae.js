
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jumbo.ae',
    timeout: null,
    country: 'AE',
    store: 'jumbo',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout || 100000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(true);

    await context.setFirstRequestTimeout(timeout);
    await context.setCssEnabled(true);
    await context.setJavaScriptEnabled(true);

    const response = await context.goto(url, {
      timeout,
      waitUntil: 'load',
      checkBlocked: false,
      load_timeout: 6000,
      first_redirect_timeout: timeout,
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 8000));
      console.log('Finished waiting');
      await context.waitForSelector('div.own-product.custom-layout, div#search-results');
    } catch (e) {
      console.log(e);
      console.log(response.status);
      if (response.status !== 404) {
        await context.reportBlocked(response.status);
        throw new Error(`Got blocked with status: ${response.status}`);
      }
    }
  },
};
