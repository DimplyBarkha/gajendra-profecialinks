
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'farmacity',
    domain: 'farmacity.com',
    url: 'https://www.farmacity.com/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="main-text"]/h2',
    zipcode: '',
  },
};
