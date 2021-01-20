
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'e-bebek.com',
    timeout: 90000,
    country: 'TR',
    store: 'e-bebek',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":90000, "force200": true}[/!opt!]`;

    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 90000,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
  },
};
