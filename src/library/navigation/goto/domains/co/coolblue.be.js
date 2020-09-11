
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'coolblue.be',
    timeout: null,
    country: 'BE',
    store: 'coolblue',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    const newUrl = await context.evaluate(function (url) {
      const searchTerm = url.split('query=')[1];
      if (searchTerm &&
        searchTerm.match(/[a-zA-Z]+/g) &&
        searchTerm.match(/[a-zA-Z]+/g).length === 1 &&
        searchTerm.toLowerCase().match(/dyson/i)
      ) {
        console.log('redirecting to dyson all products');
        return 'https://www.coolblue.be/zoeken?query=dyson+*';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
