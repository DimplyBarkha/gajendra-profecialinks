
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.ie',
    country: 'IE',
    store: 'boots',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.goto(url, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    const newUrl = await context.evaluate(function () {
      if (window.location.pathname.toLowerCase() === '/dyson') {
        return window.location.origin + '/dyson/dyson-shop-all';
      } else { return false; };
    });
    if (newUrl) {
      await context.goto(newUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    }
  },
};
