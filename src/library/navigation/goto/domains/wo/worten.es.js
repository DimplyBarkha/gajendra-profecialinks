
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'worten.es',
    timeout: null,
    country: 'ES',
    store: 'worten',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });
  },
};
