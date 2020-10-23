
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    nextLinkSelector: null,
    nextLinkXpath: "//li[contains(concat(' ',normalize-space(@class),' '),'page-item')][.//a[contains(concat(' ',normalize-space(@class),' '),'active')] or (.//a[contains(., '...')] and boolean(not(./../..//a[contains(concat(' ',normalize-space(@class),' '),'active')])))]/following-sibling::li[1]/a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.blocoproduto',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
};
