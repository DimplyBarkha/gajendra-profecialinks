
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'booker.co.uk',
    prefix: null,
    store: 'booker',
    country: 'UK',
    url: 'https://www.booker.co.uk/products/product-list?keywords={id}',
    zipcode: '',
  },
};
