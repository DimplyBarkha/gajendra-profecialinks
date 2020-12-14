
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'zalando',
    nextLinkSelector: '[class="cat_listWrapper-1zh5A"]> .cat_item-25ZBj:nth-child(3) > a > span',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//span[contains(@class,"cat_subHeadline-11sbl")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zalando.it',
    zipcode: '',
  },
};
