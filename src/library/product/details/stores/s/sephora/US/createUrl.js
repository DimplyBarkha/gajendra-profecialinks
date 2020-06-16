
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sephora.com',
    prefix: null,
    country: 'US',
    store: 'sephora',
    url: 'https://www.sephora.com/search?keyword={id}',
  },
};
