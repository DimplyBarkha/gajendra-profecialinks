
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'liverpool.mx',
    timeout: 80000,
    country: 'MX',
    store: 'liverpool',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    let { url, zipcode, storeId } = inputs;
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
