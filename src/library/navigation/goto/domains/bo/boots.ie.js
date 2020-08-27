
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.ie',
    country: 'IE',
    store: 'boots',
    zipcode: '',
    timeout: 50000,
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    const newUrl = await context.evaluate(function (url) {
      const searchTerm =
        url.match(/https:\/\/www.boots.ie\/sitesearch\?searchTerm=(.+)/) &&
        url
          .match(/https:\/\/www.boots.ie\/sitesearch\?searchTerm=(.+)/)[1]
          .toLowerCase();
      if (searchTerm &&
          searchTerm.match(/\w+/g) &&
          searchTerm.match(/\w+/g).length === 1 &&
          searchTerm.match(/dyson/)
      ) {
        return 'https://www.boots.ie/dyson/dyson-shop-all';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
