
const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    transform,
    domain: 'perfecthair.ch',
    zipcode: '',
  },  
};
