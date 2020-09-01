
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    domain: 'appliancesonline.com.au',
    store: 'appliancesonline',
    transform: transform,
  },
};
