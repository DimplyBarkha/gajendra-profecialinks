
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.pt',
    timeout: 60000,
    country: 'PT',
    store: 'fnac',
    zipcode: '',
  },

  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 250000,
      waitUntil: 'load',
      checkBlocked: true,
      embed_iframes: true,
    });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
