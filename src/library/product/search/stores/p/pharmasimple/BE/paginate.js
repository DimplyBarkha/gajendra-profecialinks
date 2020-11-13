
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    nextLinkSelector: 'li[id="pagination_next_bottom"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product_list grid row"]',
    noResultsXPath: '//p[@class="alert alert-warning"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
};
