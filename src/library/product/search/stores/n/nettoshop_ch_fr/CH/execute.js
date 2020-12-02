
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop_ch_fr',
    domain: 'nettoshop.ch',
    url: 'https://www.nettoshop.ch/search?text={searchTerms}&q=:relevance',
    loadedSelector: 'div[class="c-product-grid__item"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
