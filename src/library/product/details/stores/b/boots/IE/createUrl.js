
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'boots.ie',
    // use this with sku. pageProductId.
    url: 'https://www.boots.ie/ProductDisplay?productId={id}',
    country: 'IE',
    store: 'boots',
    zipcode: '',
  },
};
