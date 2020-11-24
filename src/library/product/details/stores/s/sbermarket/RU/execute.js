
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'sbermarket',
    domain: 'sbermarket.ru/metro',
    loadedSelector: 'div[class^="product_cards"]',
    noResultsXPath: '//div[@class="resource-not-found__header"]',
    zipcode: '',
  },
};
