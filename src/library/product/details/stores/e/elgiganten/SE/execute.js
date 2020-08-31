
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    domain: 'elgiganten.se',
    loadedSelector: 'div#site-wrapper',
    noResultsXPath: '//h2[contains(text(),"Tyvärr kunde vi inte hitta någonting som matchade din sökning")]',
    zipcode: '',
  },
};
