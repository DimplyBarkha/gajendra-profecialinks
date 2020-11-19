
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="NoSearchResultsMessage"]',
    openSearchDefinition: null,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
