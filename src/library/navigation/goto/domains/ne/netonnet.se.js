
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'netonnet.se',
    timeout: 100000,
    country: 'SE',
    store: 'netonnet',
    zipcode: '',
  },
  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {

  //   url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
  //   await context.goto(url);
  // },
};
