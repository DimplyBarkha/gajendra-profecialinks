
const { transform } = require('../transform');
const { implementation } = require('../extractImplementation');


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bedbathandbeyond',
    transform: null,
    domain: 'bedbathandbeyond.com',
    zipcode: '',
  },
  implementation,
};
