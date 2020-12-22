
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cigaretteelec.fr',
    timeout: 20000,
    zipcode: '',
    store: 'cigaretteelec',
    country: 'FR',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: parameters.timeout, waitUntil: 'load', checkBlocked: true });

    const needToAcceptCookies = await context.evaluate(() => {
      return !!document.querySelector('div[id*="accept-cookies"]');
    });
    if (needToAcceptCookies) {
      await context.click('button[class*="rgpd-acceptance"]', { timeout: 7000 });
    }
  },
};
