const {transform}=require('../IE/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.ie',
    zipcode: '',
  },
};
