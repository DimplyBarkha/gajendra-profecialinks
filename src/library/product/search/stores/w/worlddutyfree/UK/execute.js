
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    domain: 'worlddutyfree.com',
    url: "https://worlddutyfree.com/en/catalogsearch/result/?q={searchTerms}",
    loadedSelector: 'ol[class="products list items product-items"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
