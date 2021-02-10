const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'notino',
    transform,
    domain: 'notino.at',
    zipcode: '',
  },
};
