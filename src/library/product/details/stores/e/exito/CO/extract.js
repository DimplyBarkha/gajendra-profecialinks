const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'exito',
    transform,
    domain: 'exito.com',
    zipcode: '',
  },
};
