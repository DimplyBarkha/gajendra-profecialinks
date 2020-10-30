const transform = require("../../../w/walmart/US/transform");
//const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform: null,
    domain: 'elgiganten.se',
    zipcode: '',
  },
};
