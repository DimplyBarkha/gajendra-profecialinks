
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'acl-product-card-group[evtperfname*="acl-product-card-group"]',
    noResultsXPath: '//header//div[contains(text(), "something went wrong")]|//div[@id="null-search-page-container"]|//h1[contains(@class,"cl-title--large")]//span[text()="0"]|//null-search//span[contains(text(), "we found 0 result ")]|//div[contains(text(), "0 results for")]',
    openSearchDefinition: {
      template: 'https://www.homedepot.ca/search?q={searchTerms}:relevance&page={page}',
    },
    domain: 'homedepot.ca',
    zipcode: '',
  },
};
