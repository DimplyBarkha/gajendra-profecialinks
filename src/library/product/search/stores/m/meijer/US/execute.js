
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    domain: 'meijer.com',
    url: 'https://www.meijer.com/shop/en/search/?text=appetizers',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
