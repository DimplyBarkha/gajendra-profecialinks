
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'intermarche.com',
    timeout: 60000,
    country: 'FR',
    store: 'intermarche',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.captureRequests();
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // Check for correct store
    const correctStore = await context.evaluate(() => {
      return document.querySelector('[id="pdv-navbar"] button') ? document.querySelector('[id="pdv-navbar"] button').textContent === 'Brienne le Chateau' : false;
    });
    if (!correctStore) {
      await context.goto('https://www.intermarche.com/accueil/magasins/02111/brienne-le-chateau-10500');
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
  },
};
