
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediaworld.it',
    timeout: 40000,
    zipcode: '',
    store: 'mediaworld',
    country: 'IT',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    context.setBlockAds(false);
    context.setLoadAllResources(false);
    context.setAntiFingerprint(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
  },
};
