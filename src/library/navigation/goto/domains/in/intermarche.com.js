
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'intermarche.com',
    timeout: 60000,
    country: 'FR',
    store: 'intermarche',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const timeout = parameterValues.timeout || 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // Check for correct store
    const correctStore = await context.evaluate(() => {
      return document.querySelector('[id="pdv-navbar"] button').textContent === 'Brienne le Chateau';
    });
    if (!correctStore) {
      await context.goto('https://www.intermarche.com/accueil/magasins/02111/brienne-le-chateau-10500');
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
  },
};
