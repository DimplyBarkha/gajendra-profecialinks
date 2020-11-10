
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'shop.coles.com.au',
    prefix: null,
    // url: 'https://shop.coles.com.au/a/national/everything/search/{id}?pageNumber=1',
    url: 'https://shop.coles.com.au/a/alexandria/everything/search/{id}?pageNumber=1',
    country: 'AU',
    store: 'colesonline',
    zipcode: '',
  },
};
