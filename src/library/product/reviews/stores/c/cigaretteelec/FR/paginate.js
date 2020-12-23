
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'cigaretteelec',
    nextLinkSelector: 'button.netreviews_button',
    nextLinkXpath: null,
    // mutationSelector: 'div#netreviews_rating_section',
    mutationSelector: 'body',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    zipcode: '',
    domain: 'cigaretteelec.fr',
    mergeType: 'MERGE_ROWS',
  },
};
