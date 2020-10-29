module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    domain: 'elgiganten.se',
    url: 'https://www.elgiganten.se/search?SearchTerm={searchTerms}',
    loadedSelector: 'div.mini-product',
    noResultsXPath: '//h2[contains(text(),"Tyvärr kunde vi inte hitta någonting som matchade din sökning")]',
    zipcode: '',
  },
};