module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    nextLinkSelector: 'button.paginator-btn-next',
    mutationSelector: null,
    spinnerSelector: 'div.spinner.spinner-large.spinner-colorize.spinner-fixed',
    loadedSelector: 'div[data-type="items"]',
    noResultsXPath: '//span[@data-automation-id="zero-results-message"]',
    openSearchDefinition: {
      template: 'https://www.walmart.com/search/search-ng.do?grid=true&page={page}&ps=48&search_query={searchTerms}',
    },
    domain: 'walmart.com',
  },
};
