
let {transform} = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclerc',
    transform: transform,
    domain: 'leclercdrive.fr',
    zipcode: '',
  },
};
