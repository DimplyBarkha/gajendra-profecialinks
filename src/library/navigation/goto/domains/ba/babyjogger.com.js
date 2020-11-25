
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'babyjogger.com',
    timeout: 30000,
    country: 'US',
    store: 'babyjogger',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.setBlockAds(false);
    await context.setBypassCSP(true);
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setUseRelayProxy(false);
    await context.setFirstRequestTimeout(60000);
    // url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`
    url = `${url}#[!opt!]{"load_timeout":60,"enable_cache":false}[/!opt!]`

    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
