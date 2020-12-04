
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'woolworths.com.au',
    prefix: 'search/products?searchTerm=',
    url: 'woolworths.com.au/shop/search/products?searchTerm={id}',
    country: 'AU',
    store: 'WoolworthsonlineWarringahMall',
    zipcode: '',
  },
};
