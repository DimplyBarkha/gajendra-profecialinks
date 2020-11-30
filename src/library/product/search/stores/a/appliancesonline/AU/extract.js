
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    transform: transform,
    domain: 'appliancesonline.com.au',
    zipcode: '',
  },
};
