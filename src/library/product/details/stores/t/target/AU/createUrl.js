
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'target.com.au',
    prefix: null,
    url: 'https://www.target.com.au/search?text={id}',
    country: 'AU',
    store: 'target',
    zipcode: '',
  },
};
