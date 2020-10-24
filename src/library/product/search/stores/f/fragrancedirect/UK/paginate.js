
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'fragrancedirect',
    nextLinkSelector: ' div.pagination > ul > li[class=first-last ]> a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-result-content',
    noResultsXPath: '//p[@class="sorry-msg"]',
    openSearchDefinition: null,
    domain: 'fragrancedirect.co.uk',
    zipcode: '',
  },
};
