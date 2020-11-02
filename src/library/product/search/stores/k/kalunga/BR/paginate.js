
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    nextLinkSelector: null,
    nextLinkXpath: "//li[contains(concat(' ',normalize-space(@class),' '),'page-item')][.//a[contains(concat(' ',normalize-space(@class),' '),'active')] or (.//a[contains(., '...')] and boolean(not(./../..//a[contains(concat(' ',normalize-space(@class),' '),'active')])))]/following-sibling::li[1]/a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedXpath: "//div[@id='dvLoading' and contains(./@style, 'display: none;')]",
    noResultsXPath: "//p[@class='breadcrumbs__text mb-0 font-weight-5 text-secondary' and boolean(contains(., 'não retornou resultados'))]",
    stopConditionSelectorOrXpath: "//li[contains(concat(' ',normalize-space(@class),' '),'page-item')][.//a[contains(concat(' ',normalize-space(@class),' '),'active')]]/following-sibling::li[1]/a[contains(concat(' ',normalize-space(@class),' '), 'ultima')]"
    openSearchDefinition: null,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
};
