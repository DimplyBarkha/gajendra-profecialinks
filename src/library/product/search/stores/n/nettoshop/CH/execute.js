
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop',
    domain: 'nettoshop.ch',
    url: 'https://www.nettoshop.ch/search?text={searchTerms}',
    loadedSelector: 'div .c-product-grid__item-wrapper',
    noResultsXPath: '//div[@class="c-search-result ember-view"]/h1[contains(text(),"0 Ergebnisse")]',
    zipcode: '',
  },
};
