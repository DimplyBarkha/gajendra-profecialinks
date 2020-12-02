
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    domain: 'plein.nl',
    loadedSelector: 'div.owl-item.active img.owl-lazy',
    noResultsXPath: '//div[@class="no-page"]//h2[text()="Sorry, we kunnen de pagina niet vinden"]',
    zipcode: '',
  },
};
