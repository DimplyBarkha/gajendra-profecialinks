
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.co.uk',
    prefix: null,
    url: 'https://www.amazon.co.uk/dp/product/{id}?s=amazonfresh&th=1&psc=1&showDetailProductDesc=1&fpw=alm',
    // url: 'https://amazon.com/dp/product/{id}/ref=sr_1_1&dchild=1&fpw=alm&s=amazonfresh?th=1',
    country: 'UK',
    store: 'amazonFresh',
    zipcode: 'NW1 8AA',
  },
};
