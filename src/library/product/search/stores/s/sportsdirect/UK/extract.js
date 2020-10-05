const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    "country": "UK",
    "store": "sportsdirect",
    transform,
    "domain": "sportsdirect.com",
    "zipcode": "",
  },
};