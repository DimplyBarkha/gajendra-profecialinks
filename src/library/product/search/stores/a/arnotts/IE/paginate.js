
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[@class="no-hits-content-results"]',
    openSearchDefinition: {
      indexOffset: 0,
      template: 'https://www.arnotts.ie/search/?q={searchTerms}&lang=en_IE&start={offset}&sz=48',
    },
    domain: 'arnotts.ie',
    zipcode: '',
  },
};
