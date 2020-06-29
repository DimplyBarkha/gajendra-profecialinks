
module.exports = {
  parameterValues: {
    domain: 'auchandrive.fr',
    country: 'FR',
    store: 'auchandrive',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    // const cookies = [{ name: 'gtm_store_info', value: 'Paris St.Charles|54751' }, { name: 'auchanCook', value: '54751|' }];
    // await context.goto('https://www.auchandrive.fr/recherche/all#[!opt!]{"cookie_jar":[{"name":"connect.sid","value":"s%3AZXKHRVjDk2txSj8MzXQky8VZuhmTubgs.M6oBh6HGNeRWLesfG%2Bcu6No9ij6ejEqB6mVRhSQGHJs"}]}[/!opt!]', { timeout: 100000, waitUntil: 'load', checkBlocked: true });
    // await context.setCookie(...cookies);
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  },
};
