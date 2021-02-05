
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'cdw',
    // nextLinkSelector: 'a[aria-label*="Go to next page 2"]',
    //nextLinkSelector: 'div.search-pagination-list-container>a[aria-label="Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-results',
    noResultsXPath: '//div[@class="no-results-error-message"]',
    openSearchDefinition: {
      template: 'https://www.cdw.com/search/?key={searchTerms}&pcurrent={page}',
    },
    domain: 'cdw.com',
    zipcode: '',
  },
};
