
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    domain: 'cromwell.co.uk',
    url: 'https://www.cromwell.co.uk/shop?query={searchTerms}',
    loadedSelector: 'div.SearchScreen_Results.col-sm-9 > div',
    noResultsXPath: '//div[@class="NoResultsView_Body col-sm-9"]//h1',
    zipcode: '',
  },
};
