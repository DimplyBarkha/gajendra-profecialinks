
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'vardex',
    domain: 'vardex.ru',
    loadedSelector: 'div.b_product_detail',
    noResultsXPath: '//div[@class="page404"]',
    zipcode: '',
  },
};
