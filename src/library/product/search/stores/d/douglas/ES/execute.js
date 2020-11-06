
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    ccountry: 'ES',
    store: 'douglas',
    domain: 'douglas.es',
    // url: 'https://api.empathybroker.com/search/v1/query/douglas/search?banner.start=0&direct.start=0&lang=es&origin=default&promoted.start=0&q={searchTerms}&rows=24&scope=desktop&start=0&tariff=V005#[!opt!]{"type":"json"}[/!opt!]',
    url: 'https://douglas.es/?q={searchTerms}&page=6',
    loadedSelector: 'data-eb-results[id="eb-results"] data-eb-result',
    noResultsXPath: '//p[@data-translate="RESULTS_NORESULTS"]',
    zipcode: '',
  },
};
