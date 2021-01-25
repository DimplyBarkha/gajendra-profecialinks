
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'globus.ch',
    prefix: null,
    url: 'https://www.globus.ch/suche?q={id}',
    country: 'CH',
    store: 'globus',
    zipcode: '',
  },
};

