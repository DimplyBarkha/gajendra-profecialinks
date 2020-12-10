const {transform}=require('../ZA/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'takealot',
    transform,
    domain: 'takealot.com',
    zipcode: '',
  },
};
