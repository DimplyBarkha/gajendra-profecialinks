
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'myer',
    // nextLinkSelector: 'li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next > a',
    // nextLinkXpath: "//span[@class='bv-content-btn-pages-next']",
    mutationSelector: null,
    // spinnerSelector: 'li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next > a',
    // loadedSelector: 'li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next > a',
    loadedXpath: null,
    // noResultsXPath: '//li[@class=\'bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next\']/button',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'myer.com.au',
    zipcode: '',
  },
};
