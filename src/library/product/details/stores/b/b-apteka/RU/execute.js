
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    domain: 'b-apteka.ru',
    loadedSelector: 'img.product-card-x__image',
    noResultsXPath: '//div[contains[@class,"page-catalog-list"]',
    zipcode: "''",
  },
};
