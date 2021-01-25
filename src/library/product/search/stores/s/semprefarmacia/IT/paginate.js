
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'semprefarmacia',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="well clearfix"]//table//div[@class="pagination pagination-small"]//li[@class="active"]/following-sibling::li/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.well.clearfix div.div_prod_griglia.ombra_div',
    noResultsXPath: '//div[@class="tesros12"]/b',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'semprefarmacia.it',
    zipcode: '',
  },
};
