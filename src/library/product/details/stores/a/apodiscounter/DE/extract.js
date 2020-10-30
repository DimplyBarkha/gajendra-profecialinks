const { transform } =  require("../format");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    transform,
    domain: 'apodiscounter.de',
    zipcode: '',
  },
};
