module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lowes.com',
    timeout: 20000,
    country: 'US',
    store: 'lowes',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    await context.goto(url, {
      firstRequestTimeout: 60000,
      checkBlocked: true,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      load_timeout: 0,
      timeout: timeout,
      waitUntil: 'load',
    });

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
