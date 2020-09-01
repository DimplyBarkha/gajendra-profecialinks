
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    loadedSelector: "div[aria-label='Video player'] , div[class*='easyzoom--with-thumbnails']",
    noResultsXPath: null,
    zipcode: '',
  },
};
