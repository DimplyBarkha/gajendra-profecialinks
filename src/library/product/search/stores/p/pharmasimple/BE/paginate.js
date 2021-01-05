
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    nextLinkSelector: 'li:not([class*="disabled"]) i.icon-angle-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product_list grid row"] div.product-container',
    noResultsXPath: '//p[@class="alert alert-warning"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
};
