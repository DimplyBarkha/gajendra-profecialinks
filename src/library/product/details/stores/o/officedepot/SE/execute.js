
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'officedepot',
    domain: 'officedepot.se',
    loadedSelector: "table[id='cart']",
    noResultsXPath: "//h2[text()='Vi kan inte hitta den sida du söker...']",
    zipcode: '',
  },
};
