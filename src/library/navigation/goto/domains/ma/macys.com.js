
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'macys.com',
    country: 'US',
    store: 'macys',
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
