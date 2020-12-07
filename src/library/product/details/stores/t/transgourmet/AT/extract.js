const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'transgourmet',
    transform,
    domain: 'transgourmet.at',
    zipcode: "''",
  },
};
