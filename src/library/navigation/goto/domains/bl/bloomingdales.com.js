
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bloomingdales.com',
    timeout: 30000,
    country: 'US',
    store: 'bloomingdales',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBypassCSP(true);
    // await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    // await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
    await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
};
