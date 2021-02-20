
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    nextLinkSelector: 'a.ty-pagination__item.ty-pagination__btn.ty-pagination__next.cm-history.cm-ajax ',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-list,div.ty-control-group input[name="q"][value="keratase"]',
    loadedXpath: null,
    noResultsXPath: '//p[contains(@class, "no-items")]/preceding-sibling::div//input[@name="q"][not(@value="keratase")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'planethair.it',
    zipcode: '',
  },
};
