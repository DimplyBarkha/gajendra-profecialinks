
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'nemlig',
    domain: 'nemlig.com',
    loadedSelector: 'div.product-detail__info',
    noResultsXPath: "//h1[contains(text(),'Beklager - vi kunne ikke finde den side, du leder efter')]",
    zipcode: '',
  },
};
