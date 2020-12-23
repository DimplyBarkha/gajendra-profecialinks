module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'petcircle',
    nextLinkSelector: 'li.arrow.right>a,turn-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#productListing>li',
    noResultsXPath: '//div[@class="top-content"]',
    openSearchDefinition: null,
    domain: 'petcircle.com.au',
    zipcode: '',
  },
};