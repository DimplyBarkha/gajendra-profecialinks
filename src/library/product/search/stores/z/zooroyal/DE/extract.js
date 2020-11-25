
const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'zooroyal',
    transform,
    domain: 'zooroyal.de',
    zipcode: '',
  },
};
