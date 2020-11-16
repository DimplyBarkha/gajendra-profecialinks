
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'coop.ch',
    // prefix: null,
    url: 'https://www.coop.ch/de/search/?text={id}',
    country: 'CH',
    store: 'coop',
    zipcode: '',
  },
};
