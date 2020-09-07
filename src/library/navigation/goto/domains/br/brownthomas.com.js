
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'brownthomas.com',
    timeout: 30000,
    country: 'IE',
    store: 'brownthomas',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    const newUrl = await context.evaluate(function ( url ) {
      const isSelector = document.querySelector('div.slot-panels-container div.asset:nth-last-child(1) a.asset-link');
      if ( isSelector ) {
        return 'https://www.brownthomas.com/brands/dyson/shop-all/';
      }
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
