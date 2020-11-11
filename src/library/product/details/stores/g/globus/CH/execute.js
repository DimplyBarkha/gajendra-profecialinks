
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'globus',
    domain: 'globus.ch',
    loadedSelector: "div[class='mzg-catalogue-detail__mosaic-gallery'] picture source",
    noResultsXPath: "//div[contains(@class,'ErrorPage__CodeCircleText-') and text()='404']",
    zipcode: '',
  },
};
