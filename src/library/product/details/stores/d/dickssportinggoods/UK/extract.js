const {transform} = require('./shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'dickssportinggoods',
    transform: transform,
    domain: 'dickssportinggoods.com',
    zipcode: "''",
  },
};
