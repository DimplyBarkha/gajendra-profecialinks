
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bijenkorf.nl',
    timeout: null,
    country: 'NL',
    store: 'bijenkorf',
    zipcode: '',
  },
  /*implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":80000,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 500000,
      waitUntil: 'load',
      first_request_timeout: 60000,
    });
  },*/
};
