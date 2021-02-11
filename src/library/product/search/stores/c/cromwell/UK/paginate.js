
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    nextLinkSelector: 'li[class=""] a.linkNext',
    mutationSelector: null,
    spinnerSelector: 'div.ScreenLoadPending',
    loadedSelector: null,
    noResultsXPath: '//div[@class="NoResultsView_Body col-sm-9"]//h1 | //div[@class="ProductVariantScreen"]',
    openSearchDefinition: null,
    domain: 'cromwell.co.uk',
    zipcode: '',
  },
};
