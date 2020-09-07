
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'brownthomas.com',
    timeout: null,
    country: 'IE',
    store: 'brownthomas',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    const newUrl = await context.evaluate(function (url) {
      const searchTerm =
        url.match(/https:\/\/www.brownthomas.com\/search\/\?q=(.+)/) &&
        url
          .match(/https:\/\/www.brownthomas.com\/search\/\?q=(.+)/)[1]
          .toLowerCase();
      if (searchTerm &&
          searchTerm.match(/[a-zA-Z]+/g) &&
          searchTerm.match(/[a-zA-Z]+/g).length === 1 &&
          searchTerm.match(/dyson/i)
      ) {
        return 'https://www.brownthomas.com/brands/dyson/shop-all/';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
