const {transform}=require('../RU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    transform,
    domain: 'tmall.ru',
    zipcode: '',
  },
};
