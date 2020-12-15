
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    domain: 'fnac.com',
    loadedSelector: 'div[class~="f-productVisuals-mainIconZoom"]',
    noResultsXPath: '//p[contains(@class,"firstline")]',
    zipcode: '',
  },
};
