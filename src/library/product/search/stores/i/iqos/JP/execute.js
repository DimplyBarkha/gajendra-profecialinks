
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'iqos',
    domain: 'iqos.com',
    url: 'https://jp.iqos.com/shop/catalogue',
    loadedSelector: 'div#ProductList div[data-testing="ProductList_products"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
