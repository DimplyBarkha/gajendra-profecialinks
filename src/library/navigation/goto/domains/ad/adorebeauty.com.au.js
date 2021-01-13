
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'adorebeauty.com.au',
    timeout: 50000,
    country: 'AU',
    store: 'adorebeauty',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);

    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    try {
      await context.click('div#wps_popup div[data-wps-popup-close-intent]');
    } catch (e) {
      console.log(e);
    }

    let buttonNotFoundCount = 0;
    for (let i = 0; i < 20; i++) {
      try {
        await context.click('div#wps_popup div[data-wps-popup-close-intent]');
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      } catch (e) {
        console.log(e);
        buttonNotFoundCount++;
      }
      if (buttonNotFoundCount > 3) {
        break;
      }
    }
  },
};
