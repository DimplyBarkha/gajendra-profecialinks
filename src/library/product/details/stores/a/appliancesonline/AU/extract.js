const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    transform: transform,
    domain: 'appliancesonline.com.au',
    zipcode: '',
  },
};
