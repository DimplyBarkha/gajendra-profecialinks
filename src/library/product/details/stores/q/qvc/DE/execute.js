
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'qvc',
    domain: 'qvc.de',
    loadedSelector: "div[aria-label='Video player'] , div[class*='easyzoom--with-thumbnails']",
    noResultsXPath: "//h3[contains(.,'Seite kann nicht geöffnet werden')]",
    zipcode: '',
  },
};
