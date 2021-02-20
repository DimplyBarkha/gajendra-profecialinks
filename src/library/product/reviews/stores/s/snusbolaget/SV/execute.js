
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    domain: 'snusbolaget.se',
    loadedSelector: 'div.product-page',
    noResultsXPath: '//*[contains(text(),"Ojdå! Tyvärr kunde inte sidan hittas.")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
