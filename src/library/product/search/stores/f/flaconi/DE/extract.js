
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform,
    domain: 'flaconi.de',
    zipcode: '',
  },
  // implementation removed
};

