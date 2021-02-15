
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
      // timeout: 90000,
      // waitUntil: 'load',
      // checkBlocked: false,
      // load_timeout: 6000, // not too long so it can timeout
      // first_redirect_timeout: 10000,
      timeout: 90000,
      waitUntil: 'load',
      checkBlocked: false,
      load_timeout: 10000,
      // load_timeout: 6000, // not too long so it can timeout
      first_redirect_timeout: 20000,
    });
    // const popUpAccept = await context.evaluate(function () {
    //   return document.querySelector('div#privacy-cat-modal');
    // });
    // try {
    //   await context.waitForSelector('div#privacy-cat-modal', { timeout: 45000 });
    //   if (popUpAccept) {
    //     await context.click('button#btnAll-on');
    //   }
    // } catch (e) {
    //   console.log('No pop-up');
    // }
    try {
      await context.waitForSelector('body[itemtype], h1.product-title__main, div.blocListe div.productListe');
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
