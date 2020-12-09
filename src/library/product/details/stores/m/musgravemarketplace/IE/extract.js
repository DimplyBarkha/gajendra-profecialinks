const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'musgravemarketplace',
    transform,
    domain: 'musgravemarketplace.ie',
    zipcode: '',
  },
};
