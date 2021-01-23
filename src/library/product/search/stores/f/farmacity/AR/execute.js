
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'farmacity',
    domain: 'farmacity.com',
    url: 'https://www.farmacity.com/{searchTerms}',
    loadedSelector: 'div.prateleira ul li',
    noResultsXPath: '//div[@class="main-text"]/h2',
    zipcode: '',
  },
};
