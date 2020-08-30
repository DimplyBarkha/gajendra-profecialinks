
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'GB',
    store: 'qvc',
    domain: 'qvcuk.com',
    loadedSelector: "div[aria-label='Video player'] , div[class*='easyzoom--with-thumbnails']",
    noResultsXPath: null,
    zipcode: '',
  },
};
