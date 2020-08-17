
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'waitrose.com',
    prefix: 'search',
    country: 'UK',
    store: 'waitrose',
    url: 'https://www.waitrose.com/ecom/shop/search?&searchTerm={id}',
  },
};
