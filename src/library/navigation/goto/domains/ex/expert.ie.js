
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expert.ie',
    timeout: 35000,
    country: 'IE',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    // // await context.setAntiFingerprint(false);
    // // await context.setLoadAllResources(true);
    // // await context.setBlockAds(false);
    // await context.goto(`${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
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
  },
};
