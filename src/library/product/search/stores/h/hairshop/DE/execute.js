
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'hairshop',
    domain: 'hair-shop.com',
    url: 'https://www.hair-shop.com/en/catalogsearch/result/index/?p=8&q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};