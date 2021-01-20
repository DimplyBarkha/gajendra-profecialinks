
module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'saksfifthavenue',
    urlTemplate: '{id}&start={index}&sz=24',
    resultsCountSelector: 'span.search-result-count span',
    numberResultPerPage: 96,
    regExpForIdFromUrl: /(?<=com\/)(.*)/,
    transform: null,
    domain: 'saksfifthavenue.com',
    zipcode: '',
    pageIndexMultiplier: 96,
    pageStartNb: 0,
  },
};
