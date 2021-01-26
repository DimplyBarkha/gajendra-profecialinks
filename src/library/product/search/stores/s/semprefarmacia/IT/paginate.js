
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'semprefarmacia',
    nextLinkSelector: null,
    nextLinkXpath: '(//div[@class="pagination pagination-small"])[1]//li[contains(@class,"active") and not(contains(./a, ".."))]/following-sibling::li[1]',
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
