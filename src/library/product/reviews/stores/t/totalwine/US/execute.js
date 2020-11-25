
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    domain: 'totalwine.com',
    loadedSelector: 'div#BVRRContainer',
    noResultsXPath: '//div[@class="content-wrapper"]/div/h1',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
};
