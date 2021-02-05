
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sephora.com',
    timeout: 100000,
    country: 'CA',
    store: 'sephora',
    zipcode: '',
  },
  /* implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    await context.captureRequests();
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true, load_timeout: 0 });
  }, */
};
