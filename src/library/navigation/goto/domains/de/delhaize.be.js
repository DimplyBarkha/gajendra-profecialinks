
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'delhaize.be',
    timeout: 100000,
    country: 'BE',
    store: 'delhaize',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false)
    await context.goto(`${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`, { first_request_timeout: 60000, timeout:10000000, waitUntil: 'load', checkBlocked: true });
	}

};
