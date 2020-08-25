
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'did',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#catalog-listing',
    noResultsXPath: '//p[@class="note-msg"]',
    openSearchDefinition: null,
    domain: 'did.ie',
    zipcode: '',
  },
};
