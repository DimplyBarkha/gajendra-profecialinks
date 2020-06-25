
module.exports = {
  parameterValues: {
    domain: 'auchandrive.fr',
    country: 'FR',
    store: 'auchandrive',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    // const cookies = [{ name: 'gtm_store_info', value: 'Paris St.Charles|54751' }, { name: 'auchanCook', value: '54751|' }];
    await context.goto('https://www.auchandrive.fr/recherche/all#[!opt!]{"cookies":[{"name":"gtm_store_info","value":"Paris St.Charles|54751"}, { "name": "auchanCook", "value": "54751|" }]}[/!opt!]', { timeout: 100000, waitUntil: 'load', checkBlocked: true });
    // await context.setCookie(...cookies);
    await context.goto(url);
  },
};
