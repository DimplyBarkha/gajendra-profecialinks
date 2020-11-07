
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'auchan.fr',
    timeout: 1000000,
    country: 'FR',
    store: 'auchan',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url + '#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    //await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
