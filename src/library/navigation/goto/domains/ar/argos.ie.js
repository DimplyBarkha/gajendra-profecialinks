
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'argos.ie',
    timeout: 60000,
    country: 'IE',
    store: 'argos',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    url = url.replace(/%20/g, '+');
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout,
      waitUntil: 'load',
    });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    try {
      await context.click('#onetrust-accept-btn-handler');
    } catch (err) {
      console.log('No popup');
    }
  },
};
