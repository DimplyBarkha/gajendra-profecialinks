
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    nextLinkSelector: 'a.linkNext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.SearchScreen_Results.col-sm-9 > div',
    noResultsXPath: '//div[@class="NoResultsView_Body col-sm-9"]//h1',
    openSearchDefinition: null,
    domain: 'cromwell.co.uk',
    zipcode: '',
  },
};
