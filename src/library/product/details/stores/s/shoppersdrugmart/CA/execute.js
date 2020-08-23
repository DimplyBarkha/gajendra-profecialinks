
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    domain: 'shoppersdrugmart.ca',
    loadedSelector: 'div[id="pr-reviewsnippet"] div[class~="pr-rating-stars"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
