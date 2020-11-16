
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    domain: 'liquorland.com.au',
    loadedSelector: 'div.product-meta-container',
    noResultsXPath: "//div[contains(@class,'campaignHeadings')]",
    zipcode: '',
  },
};
