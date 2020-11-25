
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lloydspharmacy',
    // nextLinkSelector: 'a[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.main-content',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://lloydspharmacy.com/search?page={page}&q={searchTerms}',
      },
    domain: 'lloydspharmacy.com',
    zipcode: '',
  },
};
