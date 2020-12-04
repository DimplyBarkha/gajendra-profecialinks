
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'walmart',
    domain: 'walmart.com.ar',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="u-center"]//h3',
  },
};
