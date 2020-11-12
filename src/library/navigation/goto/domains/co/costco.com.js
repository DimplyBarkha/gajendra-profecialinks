
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    timeout: 20000,
    country: 'US',
    store: 'costco',
    zipcode: '98188',
  },
  implementation: async ({ url, storeId, zipcode }, { timeout }, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);

    const URL = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true, "cookie_jar":[{"name":"invCheckPostalCode","value":"${zipcode}"}]}[/!opt!]`

    await context.goto(URL, { timeout, waitUntil: 'load' });

    if (zipcode) {
      console.log('FOUND ZIP CODE', zipcode);
      await dependencies.setZipCode({ url, zipcode, storeId });
    }

    await context.waitForNavigation();
  },
};
