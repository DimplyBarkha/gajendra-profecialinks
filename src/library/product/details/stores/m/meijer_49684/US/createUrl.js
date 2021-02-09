
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'meijer.com',
    prefix: 'search/?text=',
    url: 'https://www.meijer.com/shop/en/search/?text={id}',
    country: 'US',
    store: 'meijer_49684',
    zipcode: '',
  },
};
