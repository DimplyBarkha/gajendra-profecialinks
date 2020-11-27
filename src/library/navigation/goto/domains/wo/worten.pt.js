
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'worten.pt',
    timeout: '100000',
    country: 'PT',
    store: 'worten',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    const URL = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"force200": true}[/!opt!]`;
    await context.goto(URL, { timeout: 100000, waitUntil: 'load' });
    await context.waitForNavigation({ timeout: 100000, waitUntil: 'networkidle0' });
    await context.waitForSelector('div.w-product-list__row');

  },
};
