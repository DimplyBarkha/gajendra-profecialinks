
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'decathlon.fr',
    prefix: null,
    url: 'https://www.decathlon.fr/search?Ntt={id}',
    country: 'FR',
    store: 'decathlon',
    zipcode: '',
  },
};
