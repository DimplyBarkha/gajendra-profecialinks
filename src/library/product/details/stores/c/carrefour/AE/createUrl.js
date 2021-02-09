
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'carrefouruae.com',
    prefix: null,
    // url: 'https://www.carrefouruae.com/p/{id}',
    url: 'https://www.carrefouruae.com/v3/search?keyword={id}',
    // url: 'https://www.carrefouruae.com/v3/search?currentPage=0&filter=&keyword={id}&nextPageOffset=0&pageSize=60&sortBy=relevance',
    country: 'AE',
    store: 'carrefour',
    zipcode: '',
  },
};
