
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    domain: 'snusbolaget.se',
    loadedSelector: 'div.product-page',
    noResultsXPath: '//*[contains(text(),"Ojdå! Tyvärr kunde inte sidan hittas.")]',
    zipcode: '',
  },
};
