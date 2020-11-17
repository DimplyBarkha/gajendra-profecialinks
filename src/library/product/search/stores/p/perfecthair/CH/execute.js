
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    domain: 'perfecthair.ch',
    url: "https://www.perfecthair.ch/en/search?sSearch={searchTerms}",
    loadedSelector: 'div[class="listing--container"] div[class="listing"] div[class="product--box box--minimal"] span[class="image--media"] img',
    noResultsXPath: "//div[contains(text(),'No products matching your search')]",
    zipcode: '',
  },
};
