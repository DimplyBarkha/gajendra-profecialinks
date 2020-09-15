
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'saturn.at',
    timeout: 50000,
    country: 'AT',
    store: 'saturn',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    timeout = timeout || 10000;
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
