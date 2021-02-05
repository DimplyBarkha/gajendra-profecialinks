
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'cdw.com',
    prefix: null,
    url: 'https://www.cdw.com/product/details/{id}',
    // url: 'https://www.cdw.com/search/?key={id}',
    country: 'US',
    store: 'cdw',
    zipcode: '',
  },
};