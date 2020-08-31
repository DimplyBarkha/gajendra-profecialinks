const transform = require("../../../w/walmart/US/transform");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    transform: null,
    domain: 'betta.com.au'
  },
};
