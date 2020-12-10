
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'metro.ua',
    prefix: 'search/?q=',
    url: 'https://shop.metro.ua/ua/search/?q={id}',
    country: 'UA',
    store: 'metro',
    zipcode: '',
  },
};
