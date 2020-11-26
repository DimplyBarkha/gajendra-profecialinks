
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jbhifi.co.nz',
    timeout: 60000,
    country: 'NZ',
    store: 'jbhifi',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { firstRequestTimeout: 60000, timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
