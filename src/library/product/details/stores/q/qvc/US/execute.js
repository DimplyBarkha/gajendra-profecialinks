
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    loadedSelector: "div[aria-label='Video player'] , div[class*='easyzoom--with-thumbnails']",
    noResultsXPath: "//h2[contains(@class,'text-center') and contains(.,'Item Not Available')]",
    zipcode: '',
  },
};
