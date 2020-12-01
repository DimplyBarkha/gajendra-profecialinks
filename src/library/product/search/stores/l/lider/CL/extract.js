
const { transform } = require("../../../../shared");
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'lider',
    transform: transform,
    domain: 'lider.cl',
    zipcode: '',
  },
};