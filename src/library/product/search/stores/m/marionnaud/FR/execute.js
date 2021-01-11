
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    domain: 'marionnaud.fr',
    url: 'https://www.marionnaud.fr/search/?text={searchTerms}', 
    loadedSelector: 'ul[class="product-listing product-grid"] li',
    // noResultsXPath: '//input[contains(@class,"more-checkbox")]',
    zipcode: '',
  },
};
