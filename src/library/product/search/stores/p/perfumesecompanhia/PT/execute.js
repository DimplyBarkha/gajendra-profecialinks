
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    domain: 'perfumesecompanhia.pt',
    url: 'https://www.perfumesecompanhia.pt/pt/procurar/?q={searchTerms}',
    loadedSelector: 'div#containerResultsFilter div.active[id] div.preview-img img',
    noResultsXPath: '//div[contains(text(), " 0 resultados")] | //div[@id="containerResultsFilter" and not(//div[contains(@class, " active")])] | //div[@id="containerResultsFilter"]//map[@name] | //div[@id="ACT-body"] | //div[@id="containerResultsFilter"]//link[@type="text/css"]',
    zipcode: '',
  },
};
