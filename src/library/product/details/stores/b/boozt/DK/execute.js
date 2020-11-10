
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    domain: 'boozt.com',
    loadedSelector: 'div.related__content',
    noResultsXPath: '//div[@class="listing-table-wrapper"]|//div[@id="preview_parent"]|//h2[@class="fsearchnoresults__header"]',
    zipcode: '',
  },
};
