
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'belgique-incontinence',
    nextLinkSelector: '#pagination > ul > li.next > a',
    nextLinkXpath: "//div[@id='pagination'] // ul //li[contains(@class,'next')]",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#list_contener',
    loadedXpath: "//div[contains(@id,'list_contener')]",
    noResultsXPath: "//p[@class='error']/font",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'belgique-incontinence.be',
    zipcode: '',
  },
};