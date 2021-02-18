const { transform } = require("./shared");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'interspar',
    transform: transform,
    domain: 'interspar.at',
    zipcode: '',
  },
  
};
