const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kidkraft',
    transform: transform,
    domain: 'kidkraft.com',
    zipcode: "''",
  },
};
