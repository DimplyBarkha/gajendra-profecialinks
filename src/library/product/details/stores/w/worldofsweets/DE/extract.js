const {transform}= require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    transform: transform,
    domain: 'worldofsweets.de',
    zipcode: "''",
  },
};
