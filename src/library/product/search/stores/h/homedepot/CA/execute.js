module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    url: 'https://www.homedepot.ca/search?q={searchTerms}:relevance&page=1',
    loadedSelector: 'acl-product-card-group[evtperfname*="acl-product-card-group"]',
    noResultsXPath: '//header//div[contains(text(), "something went wrong")]|//div[@id="null-search-page-container"]|//h1[contains(@class,"cl-title--large")]//span[text()="0"]|//null-search//span[contains(text(), "we found 0 result ")]|//div[contains(text(), "0 results for")] | //div[@class="hdca-cms-content-banner__content-box"]',
    zipcode: '',
  },
};
