
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mumzworld.com',
    timeout: 50000,
    country: 'AE',
    store: 'mumzworld',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'load', block_ads: false });
  },
};
