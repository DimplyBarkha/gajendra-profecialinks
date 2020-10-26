
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'extra',
    domain: 'extra.com',
    url: 'https://www.extra.com/en-sa/search/?q={searchTerms}&pageSize=100000',
    loadedSelector: 'div.c_product-listing',
    noResultsXPath: "//h3[contains(text(),'No results found for your search')]",
    zipcode: "''",
  },
};
