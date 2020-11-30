const transform = require("../../../w/walmart/US/transform");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    transform: null,
    domain: 'mall.com',
    zipcode: '',
  },
};
