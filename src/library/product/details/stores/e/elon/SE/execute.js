
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'elon',
    domain: 'elon.se',
    noResultsXPath: '//div[contains(@class,"message notice")]',
    zipcode: '',
  },
};
