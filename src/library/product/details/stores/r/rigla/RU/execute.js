
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    domain: 'rigla.ru',
    loadedSelector: 'div.product-cart__content',
    noResultsXPath: '//p[@class="page404__text"]',
    zipcode: "''",
  },
};
