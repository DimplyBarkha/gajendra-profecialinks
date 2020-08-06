
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    url: 'https://amazon.com/dp/{id}',
    country: 'GLOBAL',
    store: 'amazonMsDetails',
    zipcode: '',
  },
};
