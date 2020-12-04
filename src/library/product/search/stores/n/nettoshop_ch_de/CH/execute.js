
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop_ch_de',
    domain: 'nettoshop.ch',
    url: 'https://www.nettoshop.ch/fr/search?text={searchTerms}',
    loadedSelector: 'div[class="c-product-grid__item"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
