
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'nordicfeel',
    domain: 'nordicfeel.se',
    loadedSelector: "a[class='js-gallery-item'] img[class='display-image']",
    noResultsXPath: "//h1[text()='Sidan kunde inte hittas']",
    zipcode: '',
  },
};
