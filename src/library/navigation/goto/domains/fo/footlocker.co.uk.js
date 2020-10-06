module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'footlocker.co.uk',
    country: 'UK',
    store: 'footlocker',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.goto((url + '#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]'), { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
