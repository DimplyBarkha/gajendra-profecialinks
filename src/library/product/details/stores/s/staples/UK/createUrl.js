
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'staples.co.uk',
    // prefix: 'search?keywords=',
    url: 'http://www.staples.co.uk/search?keywords={id}',
    country: 'UK',
    store: 'staples',
    zipcode: '',
  },
};
