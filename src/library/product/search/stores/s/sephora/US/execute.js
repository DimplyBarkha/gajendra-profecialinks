
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    domain: 'sephora.com',
    url: 'https://www.sephora.com/search?keyword={searchTerms}&pageSize=150#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]',
    // loadedSelector: ['div[data-comp="ProductGrid "] a','div[data-at="product_tabs_section"]'],
    // noResultsXPath: '//div[contains(@data-comp, "NoSearchResults")]',
    zipcode: '',
  },
};