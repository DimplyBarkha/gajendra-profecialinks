const { cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'handlawillys',
    transform: cleanUp,
    domain: 'willys.se',
    zipcode: '',
  },
};
