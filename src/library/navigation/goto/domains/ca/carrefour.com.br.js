module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.com.br',
    timeout: 100000,
    country: 'BR',
    store: 'Carrefour',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      images_enabled: true,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
