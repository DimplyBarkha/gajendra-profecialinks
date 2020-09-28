const{transform} = require('../../../../shared');


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform: transform,
    domain: 'myer.com.au',
    zipcode: '',
  },
};
