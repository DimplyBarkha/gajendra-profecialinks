
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'dyson',
    domain: 'dyson.co.uk',
    url: 'https://www.dyson.co.uk/search-results.html?searchText={searchTerms}&from=product',
    // url: 'https://www.dyson.co.uk/search-results.html?searchText={searchTerms}&from=product#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]',
    loadedSelector: '#Products-Data .search-count',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"] | //link[@rel="canonical" and not(contains(@href, "search"))] | //div[contains(@class,"search-empty__container")][contains(.,"experiencing technical issues")]',
  },
};
