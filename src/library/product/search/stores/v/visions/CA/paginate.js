
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    nextLinkSelector: "a[id='ContentPlaceHolder1_ctrlResultBarPagerUC2_lnkNextpage']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div[class*='prodlist-itembox']",
    noResultsXPath: "//td[@id='catenav-content-col2']//h3[contains(.,'No product found.')]",
    openSearchDefinition: null,
    domain: 'visions.ca',
    zipcode: '',
  },
};
