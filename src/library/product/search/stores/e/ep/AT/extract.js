
const {transform} = require('./transform')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    transform: transform,
    domain: 'ep.at',
    zipcode: '',
  },
};
