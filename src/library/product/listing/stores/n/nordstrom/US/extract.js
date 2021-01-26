
module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    urlTemplate: '{id}&page={page}',
    resultsCountSelector: 'main section header nav div',
    numberResultPerPageXPath: 72,
    regExpForIdFromUrl: '(?<=com\/)(.*)',
    transform: null,
    domain: 'nordstrom.com',
    zipcode: '',
  },
};
