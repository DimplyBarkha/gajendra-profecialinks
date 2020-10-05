
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'courir.com',
    prefix: null,
    url: `https://www.courir.com/fr/search?q={id}&lang=fr_FR`,
    country: 'FR',
    store: 'courir',
    zipcode: '',
  },
};
