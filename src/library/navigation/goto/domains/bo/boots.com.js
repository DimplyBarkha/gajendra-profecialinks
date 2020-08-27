
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
    const newUrl = await context.evaluate(function (url) {
      const searchTerm =
        url.match(/https:\/\/www.boots.com\/sitesearch\?searchTerm=(.+)/) &&
        url
          .match(/https:\/\/www.boots.com\/sitesearch\?searchTerm=(.+)/)[1]
          .toLowerCase();
      if (
        window.location.pathname.toLowerCase() === '/dyson' ||
        (searchTerm &&
          searchTerm.match(/\w+/) &&
          searchTerm.match(/\w+/).length === 1 &&
          searchTerm.match(/dyson/))
      ) {
        return 'https://www.boots.com/dyson/dyson-shop-all';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
