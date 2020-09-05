
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    loadedSelector: 'div.product-main',
    noResultsXPath: '//div[@class="page-not-found"]',
    zipcode: "''",
  },
};
