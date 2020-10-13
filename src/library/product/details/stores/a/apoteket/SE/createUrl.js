
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'apoteket.se',
    prefix: null,
    url: 'https://www.apoteket.se/sok/?q={id}',
    country: 'SE',
    store: 'apoteket',
    zipcode: '',
  },
};
