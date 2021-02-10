
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'mon-liquide',
    nextLinkSelector: 'ul.pagination li[class="active current"] + li a',
    nextLinkXpath: '//ul[@class="pagination"]//li[@class="active current"]/following-sibling::li[1]//a',
    mutationSelector: 'div#center_column ul.product_list',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mon-liquide.fr',
    zipcode: "''",
  },
};
