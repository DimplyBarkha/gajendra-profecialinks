module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'petcircle',
    domain: 'petcircle.com.au',
    url: 'https://www.petcircle.com.au/search/{searchTerms}',
    loadedSelector: 'ul#productListing>li',
    noResultsXPath: '//div[@class="top-content"]',
    zipcode: '',
  },
};