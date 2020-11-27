
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    domain: 'dns-shop.ru',
    loadedSelector: 'div.opinions-widget',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
