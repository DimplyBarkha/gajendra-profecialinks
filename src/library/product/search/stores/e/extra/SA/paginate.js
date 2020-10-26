
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'extra',
    nextLinkSelector: 'li.c_pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.c_product-listing',
    noResultsXPath: "//h3[contains(text(),'No results found for your search')]",
    openSearchDefinition: null,
    domain: 'extra.com',
    zipcode: "''",
  },
};
