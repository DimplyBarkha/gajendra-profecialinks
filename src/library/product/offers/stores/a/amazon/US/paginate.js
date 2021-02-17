module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    spinnerSelector: null,
    loadedSelector: '.olpOffer',
    stopConditionSelectorOrXpath: '.a-pagination>li.a-disabled.a-last',
    noResultsXPath: '//div[@id="olpOfferList"]/div/p | //*[@id="be"]//*[not(contains(text(), "OfferListing")) and contains(text(), "ue_pty")]',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      indexOffset: 0,
      template: 'https://www.amazon.com/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10&f_new=true&startIndex={offset}',
    },
    domain: 'amazon.com',
  },
};
