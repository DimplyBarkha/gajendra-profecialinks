module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsmart.ca',
    timeout: 100000,
    country: 'CA',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"discard_CSP_header":true,"force200": true}[/!opt!]`;
    await context.setBypassCSP(true);
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
    await context.evaluate(() => {
      if (document.querySelector("#main > div.error-page-content > div > div")) {
        throw new Error('Not a product Page');
      }
    });
  },
};
