
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    domain: 'pontofrio.com.br',
    loadedSelector: 'div#gallery',
    noResultsXPath: '//div[@class="not-found"]',
    zipcode: '',
  },
};
