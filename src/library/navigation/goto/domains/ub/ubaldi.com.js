
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ubaldi.com',
    timeout: null,
    country: 'FR',
    store: 'ubaldi',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout = 20000 }, context, dependencies) => {
    url = url.replace(/\s+|(%20)/g, '-');
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    const pathName = await context.evaluate(() => {
      return window.location.pathname;
    });
    console.log('pathName: ', pathName);
    if (pathName === '/dyson/dyson.php') {
      await context.goto('https://www.ubaldi.com/recherche/dyson-brand.php', { timeout, waitUntil: 'load', checkBlocked: true });
    }
  },
};
