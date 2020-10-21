
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'digitec.ch',
    timeout: 60000,
    country: 'CH',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    // url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);
    url = `${url}#[!opt!]{"proxy":{"use_relay_proxy":false},"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]`;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
