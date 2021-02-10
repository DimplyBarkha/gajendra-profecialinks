
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'shop.coles.com.au',
    prefix: null,
    // https://shop.coles.com.au/a/a-vic-metro-burwood-east/everything/search/1014180P?pageNumber=1
    url: 'https://shop.coles.com.au/a/burwood-east/everything/search/{id}?pageNumber=1',
    country: 'AU',
    store: 'colesonline_burwoodEast',
    zipcode: '',
  },
};
