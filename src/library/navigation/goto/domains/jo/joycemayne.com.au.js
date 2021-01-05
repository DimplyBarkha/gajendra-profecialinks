
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'joycemayne.com.au',
    timeout: 500000,
    country: 'AU',
    store: 'joycemayne',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setAntiFingerprint(false);
    //await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { first_request_timeout: 50000, timeout: timeout, waitUntil: 'load', checkBlocked: false });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
  //   await context.goto(url, {
  //     block_ads: false,
  //     load_all_resources: true,
  //     images_enabled: true,
  //     timeout: 800000,
  //     waitUntil: 'load',
  //   });
  // },
};
