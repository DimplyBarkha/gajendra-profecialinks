
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    domain: 'totalwine.com',
    loadedSelector: 'div#BVRRContainer',
    noResultsXPath: '//div[@class="content-wrapper"]/div/h1 | //h1[contains(., "Sorry we’re coming up dry.") and contains(.,"Whoops!")]',
    reviewUrl: 'https://www.totalwine.com/p/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
