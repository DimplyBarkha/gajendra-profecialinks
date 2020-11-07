const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'apo-rot',
    transform: transform,
    domain: 'apo-rot.de',
    zipcode: "''",
  },
  
};
