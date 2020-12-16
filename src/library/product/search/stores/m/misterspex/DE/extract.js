
  
const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    transform: null,
    domain: 'misterspex.de',
    zipcode: '',
  },
};
