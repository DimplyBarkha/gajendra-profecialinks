
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'dyson',
    domain: 'dyson.pl',
    zipcode: '',
    url: 'https://www.dyson.pl/catalogsearch/result/?q={searchTerms}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]',
    loadedSelector: 'ul.search-results__results-list li',
    noResultsXPath: '//form[contains(@class, "search-results__form")]//following-sibling::*[contains(text(), "nie zwróciło wyników")]',

  },
};
