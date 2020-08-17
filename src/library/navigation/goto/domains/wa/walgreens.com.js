
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walgreens.com',
    country: 'US',
    store: 'walgreens',
    timeout: 30000,
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.setBypassCSP(true);
    // await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
    await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
    // await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  },
};
