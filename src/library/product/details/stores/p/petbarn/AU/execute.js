
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'petbarn',
    domain: 'petbarn.com.au',
    loadedSelector: "a[id='main-image'] img[class='zoomImg']",
    noResultsXPath: "//div[@class='not-found-container']//div[@class='not-found-wrapper']",
    zipcode: '',
  },
};
