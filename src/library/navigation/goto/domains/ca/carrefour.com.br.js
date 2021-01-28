module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.com.br',
    timeout: 70000,
    zipcode: '',
    store: 'carrefour',
    country: 'BR',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 70000;
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
