const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'hulpmiddelwereld',
    transform,
    domain: 'hulpmiddelwereld.nl',
    zipcode: '',
  },
};
