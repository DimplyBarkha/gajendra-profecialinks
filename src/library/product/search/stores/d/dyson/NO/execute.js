
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'dyson',
    domain: 'dyson.no',
    url: 'https://www.dyson.no/sokeresultater.html?searchText={searchTerms}&from=product#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]',
    loadedSelector: '#Products-Data .search-count',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"] | //link[@rel="canonical" and not(contains(@href, "sokeresultater"))]',
    zipcode: '',
  },
};
