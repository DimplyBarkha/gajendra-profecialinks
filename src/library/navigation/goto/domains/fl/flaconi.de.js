
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'flaconi.de',
    timeout: 90000,
    country: 'DE',
    store: 'flaconi',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.setJavaScriptEnabled(true);
    
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    if (await context.evaluate(() => !!document.querySelector('#uc-btn-accept-banner'))) {
      await context.click('#uc-btn-accept-banner');
    }
  },
};
