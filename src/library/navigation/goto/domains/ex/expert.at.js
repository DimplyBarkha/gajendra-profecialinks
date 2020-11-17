
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expert.at',
    timeout: 35000,
    country: 'AT',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    // await context.goto(`${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  },
};
