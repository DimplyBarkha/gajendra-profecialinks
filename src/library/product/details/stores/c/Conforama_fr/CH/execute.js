
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'Conforama_fr',
    domain: 'conforama.ch',
    loadedSelector: 'div[id="main"]',
    noResultsXPath: '//h1[@class="infopage x-large"]',
    zipcode: '',
  },
};
