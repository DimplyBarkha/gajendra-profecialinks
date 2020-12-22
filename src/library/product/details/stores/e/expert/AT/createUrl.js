
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'expert.at',
    prefix: null,
    country: 'AT',
    store: 'expert',
    zipcode: '',
    url: 'https://www.expert.at/shop/*~p{id}',
  },
};
