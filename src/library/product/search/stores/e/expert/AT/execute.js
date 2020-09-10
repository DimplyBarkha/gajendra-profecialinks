
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    domain: 'expert.at',
    url: 'https://www.expert.at/shop/?q={searchTerms}',
    loadedSelector: 'section.product-grid',
    noResultsXPath: '//*[contains(text(),"Leider aktuell kein Treffer zu Ihrem Suchbegriff")]|//div[contains(@class, "marken-img-slider__item")]',
    zipcode: '',
  },
};
