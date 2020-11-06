
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    // openSearchDefinition: {
    //   offset: 24,
    //   template: 'https://api.empathybroker.com/search/v1/query/douglas/search?banner.start=0&direct.start=0&lang=es&origin=default&promoted.start=0&q={searchTerms}&rows=24&scope=desktop&start={offset}&tariff=V005#[!opt!]{"type":"json"}[/!opt!]',
    // },
    //spinnerSelector: '#eb-loading-spinning-balls',
    // spinnerSelector: 'div.rd__offcanvas__content__spinner div div span',
    // openSearchDefinition: {
    //   template: 'https://douglas.es/?q={searchTerms}&page=6',
    // },
    loadedSelector: 'data-eb-results[id="eb-results"] data-eb-result',
    noResultsXPath: '//p[@data-translate="RESULTS_NORESULTS"]',
    domain: 'douglas.es',
    zipcode: '',
  },
};
