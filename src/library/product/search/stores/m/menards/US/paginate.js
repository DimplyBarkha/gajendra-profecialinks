
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'menards',
    // nextLinkSelector: 'a[class="btn btn-circle"] i',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="container"]>section',
    noResultsXPath: '//div[@id="noSearchResults"]',
    openSearchDefinition: {
      // pageStartNb: 2,
      template: 'https://www.menards.com/main/search.html?ipp=36&search={searchTerms}&page={page}',
      },
    domain: 'menards.com',
    zipcode: '',
  },
};
