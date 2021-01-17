
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    domain: 'planethair.it',
    loadedSelector: 'div[class="ty-product-block product-main-info"]',
    noResultsXPath: '//h2[contains(text(), "Mappa del sito")]',
    zipcode: '',
  },
};
