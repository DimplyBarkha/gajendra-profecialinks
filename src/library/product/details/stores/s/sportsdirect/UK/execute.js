
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    domain: 'sportsdirect.com',
    loadedSelector: '.bv_numReviews_component_container>.bv_numReviews_text',
    noResultsXPath: '//div[contains(@class,"SubHead")]/h2',
    zipcode: '',
  },
};
