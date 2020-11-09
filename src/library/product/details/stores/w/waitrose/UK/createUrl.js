
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'waitrose.com',
    prefix: null,
    country: 'UK',
    store: 'waitrose',
    url: 'https://www.waitrose.com/ecom/shop/search?&searchTerm={id}',
    zipcode: '',
  },
};
