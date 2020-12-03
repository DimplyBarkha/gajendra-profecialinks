
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    domain: 'dns-shop.ru',
    loadedSelector: 'div.opinions-widget',
    noResultsXPath: null,
    reviewUrl: 'https://www.dns-shop.ru/search/?q={id}/opinion/',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
