
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    url: 'https://www.walmart.ca/search?q={searchTerms}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]',
    loadedSelector: "[data-automation*='product-results'] [data-automation*='product']",
    noResultsXPath: "//div[contains(@data-automation,'search-result-header') and contains(.,'We couldn')] | //h1[contains(@data-automation,'null-results-message')]",
    zipcode: '',
  },
};
