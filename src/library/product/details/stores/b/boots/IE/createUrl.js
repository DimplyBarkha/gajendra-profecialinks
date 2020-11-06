
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'boots.ie',
    url: 'https://www.boots.com/ProductDisplay?productId={id}',
    country: 'IE',
    store: 'boots',
    zipcode: '',
  },
};
