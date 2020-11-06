const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'albertsons',
    transform,
    domain: 'albertsons.com',
    zipcode: '83642',
  },
};
