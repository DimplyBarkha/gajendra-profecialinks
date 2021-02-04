
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'jiomart',
    domain: 'jiomart.com',
    url: 'https://www.jiomart.com/catalogsearch/result?q={searchTerms}',
    loadedSelector: 'div[class*=cat-item]',
    noResultsXPath: '//div[@class="noresult"]',
    zipcode: '560012',
  },
};
