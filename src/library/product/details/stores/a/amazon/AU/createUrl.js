
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com.au',
    prefix: null,
    url: 'https://www.amazon.com.au/dp/{id}?th=1&psc=1',
    // 'https://www.amazon.com.au/dp/{id}/ref=sr_1_1?dchild=1&keywords={id}',
    // https://www.amazon.com.au/Other-Mother-Matthew-Green/dp/1472152395/ref=sr_1_1?dchild=1&keywords=1472152395
    country: 'AU',
    store: 'amazon',
    zipcode: '',
  },
};
