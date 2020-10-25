
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    domain: 'digitec.ch',
    loadedSelector: "picture[class*='mediaPicture'] img",
    noResultsXPath: "//h2[contains(@class,'error')]",
    zipcode: '',
  },
};
