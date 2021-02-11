const {transform}=require('../BE/format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_fr',
    transform,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
