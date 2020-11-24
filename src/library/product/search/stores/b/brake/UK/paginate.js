
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product__grid',
    noResultsXPath: '//div[@class="search-empty"]',
    openSearchDefinition: {
      template: 'https://www.brake.co.uk/search?q={searchTerms}:relevance&page={page}',
    },
    domain: 'brake.co.uk',
    zipcode: '',
  },
};
