
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'teknosa.com',
    timeout: 50000,
    country: 'TR',
    store: 'teknosa',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    await context.captureRequests();
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true, load_timeout: 0 });
  },
};
