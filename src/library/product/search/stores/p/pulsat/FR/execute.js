
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    domain: 'pulsat.fr',
    url: 'https://www.pulsat.fr/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div[class="item product-list-col"] article',
    noResultsXPath: '//div[@class="alert alert-info"]//text()',
    zipcode: '',
  },
};
