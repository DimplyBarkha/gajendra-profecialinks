
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.com',
    country: 'GB',
    store: 'boots',
    zipcode: '',
    timeout: 50000,
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    await context.waitForNavigation({ waitUntil: 'networkidle0' });
    const newUrl = await context.evaluate(function (url) {
      const searchTerm = url.match(/https:\/\/www.boots.com\/sitesearch?searchTerm=(.+)/) && url.match(/https:\/\/www.boots.com\/sitesearch?searchTerm=(.+)/)[1].toLowerCase();
      if (
        window.location.pathname.toLowerCase() === '/dyson' ||
        (searchTerm &&
          searchTerm.match(/\w+/) &&
          searchTerm.match(/\w+/).length === 1 &&
          searchTerm.match(/dyson/))
      ) {
        return window.location.origin + '/dyson/dyson-shop-all';
      } else {
        return false;
      };
    }, url);

    if (newUrl) {
      await context.goto(newUrl, { timeout, waitUntil: 'load', checkBlocked: true });
    }
  },
};
