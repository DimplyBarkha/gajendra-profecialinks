
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sephora.com.au',
    prefix: null,
    url: 'https://www.sephora.com.au/search?q={id}',
    country: 'AU',
    store: 'sephora',
    zipcode: '',
  },
};
