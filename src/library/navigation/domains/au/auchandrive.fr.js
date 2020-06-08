
module.exports = {
  parameterValues: {
    domain: 'auchandrive.fr',
    country: 'FR',
    store: 'auchandrive',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const cookies = [{ name: 'gtm_store_info', value: 'Paris St.Charles|54751' }, { name: 'auchanCook', value: '54751|' }];
    await context.goto('https://www.auchandrive.fr/', { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.setCookies(...cookies);
    await context.goto({ url }, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
