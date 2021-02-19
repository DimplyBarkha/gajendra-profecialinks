
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    // nextLinkSelector: 'a[title="Next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="main-content"]',
    noResultsXPath: '//div[@class="row"]/h1',
    openSearchDefinition: {
      template: 'https://www.tigerdirect.com/applications/SearchTools/search.asp?page={page}&keywords={searchTerms}&sort=0&recs=10',
      },
    domain: 'tigerdirect.com',
    zipcode: '',
  },
};
