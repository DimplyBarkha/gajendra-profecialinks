
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'dyson',
    domain: 'dyson.sa',
    url: 'https://www.sa.dyson.com/en-SA/catalogsearch/result/?q={searchTerms}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]',
    loadedSelector: 'ul.search-results__results-list li',
    noResultsXPath: '//div[contains(@class,"layout")]/*[contains(text(), "returned no results")]',
    zipcode: '',
  },
};
