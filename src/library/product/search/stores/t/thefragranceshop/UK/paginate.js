module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    nextLinkSelector: 'li:last-child a.btn.btn-default.btn-smangle-left',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.col-sm-12.col-xs-12.no-padding.gridView',
    noResultsXPath: '//div[@class="fnl-landing-noresults"]',
    openSearchDefinition: null,
    domain: 'thefragranceshop.co.uk',
    zipcode: '',
  },
};