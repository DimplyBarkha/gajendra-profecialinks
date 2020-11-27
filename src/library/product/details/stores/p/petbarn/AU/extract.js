
const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petbarn',
    transform,
    domain: 'petbarn.com.au',
    zipcode: '',
  },
};
