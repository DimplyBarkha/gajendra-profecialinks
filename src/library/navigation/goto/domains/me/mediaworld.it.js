
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediaworld.it',
    timeout: 40000,
    zipcode: '',
    store: 'mediaworld',
    country: 'IT',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    context.setLoadImages(true);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });
  },
};
