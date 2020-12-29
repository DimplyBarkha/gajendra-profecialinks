
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'boots.com',
    // use this with sku. pageProductId.
    url: 'https://www.boots.com/ProductDisplay?productId={id}',
    country: 'UK',
    store: 'boots',
    zipcode: '',
  },
};
