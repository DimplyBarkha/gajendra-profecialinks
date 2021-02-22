
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'nettoshop.ch',
    timeout: 120000,
    country: 'CH',
    store: 'nettoshop_ch_fr',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    // await context.setBypassCSP(true);
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
    await context.goto(inputUrl, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: false });
    // await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
};
