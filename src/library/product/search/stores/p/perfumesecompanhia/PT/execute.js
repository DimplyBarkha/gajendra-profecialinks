
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    domain: 'perfumesecompanhia.pt',
    url: 'https://www.perfumesecompanhia.pt/pt/procurar/?q={searchTerms}',
    loadedSelector: 'div.col.active',
    noResultsXPath: '//div[contains(text(), "0 resultados")]',
    zipcode: '',
  },
};
