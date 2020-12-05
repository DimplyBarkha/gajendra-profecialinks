
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'worten.es',
    timeout: null,
    country: 'ES',
    store: 'worten',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false); 
    // const URL = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    const URL = url;
    await context.goto(URL, { timeout: 50000, waitUntil: 'load' });
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
  },
};
