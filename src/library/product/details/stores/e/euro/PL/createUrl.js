
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'euro.com.pl',
    //prefix: null,
    url: 'https://www.euro.com.pl/search.bhtml?keyword={id}',
    country: 'PL',
    store: 'euro',
    zipcode: '',
  },
};
