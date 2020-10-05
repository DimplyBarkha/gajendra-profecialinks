
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'selfridges.com',
    prefix: '?freeText=',
    url: 'https://www.selfridges.com/GB/en/cat/?freeText={id}',
    country: 'UK',
    store: 'selfridges',
    zipcode: '',
  },
};
