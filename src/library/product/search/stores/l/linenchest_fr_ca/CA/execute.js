
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'linenchest_fr_ca',
    domain: 'linenchest.com',
    url: 'https://www.linenchest.com/fr_ca/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.with-facets div.ais-Hits',
    // noResultsXPath: '//div[@class="result-wrapper"]/a/@data-objectid',
    zipcode: '',
  },
};
