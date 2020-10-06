
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    domain: 'visions.ca',
    loadedSelector: "div[id='productimg-box'] img",
    noResultsXPath: "//h1[contains(.,'Server Error')] | //div[contains(@id,'iconcate-container')]",
    zipcode: '',
  },
};
