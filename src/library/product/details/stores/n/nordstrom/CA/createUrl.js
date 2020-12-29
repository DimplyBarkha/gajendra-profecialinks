
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'nordstrom.ca',
    // url: 'https://www.nordstrom.ca/s/{id}',
    url: 'https://www.nordstrom.ca/s/{id}?origin=keywordsearch-personalizedsort',
    country: 'CA',
    store: 'nordstrom',
  },
};
