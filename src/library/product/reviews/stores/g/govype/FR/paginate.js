
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'govype',
    nextLinkSelector: '#netreviews_button_more_reviews:not([style^="display: none;"])',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'a.netreviews_button.active',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div.netreviews_review_part',
    openSearchDefinition: null,
    domain: 'govype.com',
    zipcode: "''",
  },
};
