module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'homedepot.ca',
    prefix: null,
    url: 'https://www.homedepot.ca/api/search/v1/search?q={id}',
    country: 'CA',
    store: 'homedepot',
    zipcode: '',
  },
};
