
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'costco.com',
    store: 'costcoLg',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true }[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      js_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
  },
};
