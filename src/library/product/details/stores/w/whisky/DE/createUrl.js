
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'whisky.de',
    prefix: null,
    url: 'https://www.whisky.de/shop/index.php?stoken={id}&lang=0&cl=search&searchparam={id}',
    country: 'DE',
    store: 'whisky',
    zipcode: '',
  },
};
