
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'power.no',
    prefix: null,
    url: 'https://www.power.no/hvitevarer/p-{id}/',
    country: 'NO',
    store: 'power',
    zipcode: '',
  },
};
