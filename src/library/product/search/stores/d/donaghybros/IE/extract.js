
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'donaghybros',
    transform,
    domain: 'donaghybros.ie',
  },
};
