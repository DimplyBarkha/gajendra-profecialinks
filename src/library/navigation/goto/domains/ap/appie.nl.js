
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'appie.nl',
    timeout: 100000,
    country: 'NL',
    store: 'Appie',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 500000,
      waitUntil: 'load',
    });
  },
};
