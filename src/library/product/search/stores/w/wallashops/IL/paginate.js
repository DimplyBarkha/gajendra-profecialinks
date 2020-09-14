
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'wallashops',
    nextLinkSelector: 'li[class*="lnextnavbtn"] a:not(.disablePageNaxt)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class*="items_strip_bk"]',
    noResultsXPath: '//h2[contains(text(), "לא נמצאו")]‎',
    openSearchDefinition: null,
    domain: 'wallashops.co.il',
    zipcode: '',
  },
};
