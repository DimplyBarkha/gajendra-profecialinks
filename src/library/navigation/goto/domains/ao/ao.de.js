
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ao.de',
    timeout: 80000,
    country: 'DE',
    store: 'ao',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.setBypassCSP(true);
    // await context.setCssEnabled(true);
    // await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false, "first_request_timeout":60,"load_timeout":60}[/!opt!]`;
    await context.goto(inputUrl, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: false });
  },
};