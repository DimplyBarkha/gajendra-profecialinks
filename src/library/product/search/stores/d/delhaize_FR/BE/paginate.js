
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_FR',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="NoSearchResultsMessage"]',
    openSearchDefinition: null,
    domain: 'delhaize_FR.be',
    zipcode: '',
  },
};
