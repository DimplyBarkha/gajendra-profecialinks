
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    country: 'US',
    store: 'amazonFresh',
    url: 'https://www.amazon.com/dp/product/{id}?s=amazonfresh&th=1&psc=1',
    // url: 'https://amazon.com/dp/product/{id}/ref=sr_1_1&dchild=1&fpw=alm&s=amazonfresh?th=1',
  },
};
