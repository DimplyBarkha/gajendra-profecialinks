
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com.mx',
    timeout: 60000,
    country: 'MX',
    store: 'walmart',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":60000,"force200":true}[/!opt!]`;
    await context.captureRequests();
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true, load_timeout: 0 });
  },
};
