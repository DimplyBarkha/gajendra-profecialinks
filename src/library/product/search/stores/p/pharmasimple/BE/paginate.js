
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product_list grid row"] div.product-container',
    noResultsXPath: '//p[@class="alert alert-warning"]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://pharmasimple.com/module/ambjolisearch/jolisearch?search_query={searchTerms}&p={page}',
    },
    domain: 'pharmasimple.com',
    zipcode: '',
  },
};
