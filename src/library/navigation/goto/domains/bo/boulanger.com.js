
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boulanger.com',
    timeout: null,
    country: 'FR',
    store: 'boulanger',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.setBlockAds(false);
    // await context.goto(url, { timeout: 90000, waitUntil: 'networkidle0', block_ads: false });
    const response = await context.goto(url, {
      timeout: 10000,
      waitUntil: 'load',
      checkBlocked: false,
      load_timeout: 6000, // not too long so it can timeout
      first_redirect_timeout: 10000,
    });
    try {
      await context.waitForSelector('body[itemtype], h1.product-title__main');
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
