
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walmart.com.mx',
    prefix: null,
    url: 'https://www.walmart.com.mx/productos?Ntt={id}',
    country: 'MX',
    zipcode: '',
    store: 'walmart',
  },
};
