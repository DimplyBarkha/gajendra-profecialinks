
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'gittigidiyor.com',
    timeout: 55000,
    country: 'TR',
    store: 'gittigidiyor',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setCssEnabled(true);
    await context.setJavaScriptEnabled(true);
    // await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true}[/!opt!]`;
    await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  },
};
