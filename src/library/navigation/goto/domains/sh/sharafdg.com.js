
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sharafdg.com',
    timeout: 60000,
    country: 'AE',
    store: 'sharafdg',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
  },
};
