
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    domain: 'mechta.kz',
    loadedSelector: 'div.aa_catalogdetail',
    noResultsXPath: "//font[contains(text(),'Элемент не найден')]",
    zipcode: '',
  },
};
