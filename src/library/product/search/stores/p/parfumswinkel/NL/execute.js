module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'parfumswinkel',
    domain: 'parfumswinkel.nl',
    url: 'https://www.parfumswinkel.nl/catalogsearch/result/index/?q={searchTerms}',
    loadedSelector: 'div.catalog-products',
    noResultsXPath: '//div[contains(@class,"no-results-container col-12")]',
    zipcode: "''",
  },
};
