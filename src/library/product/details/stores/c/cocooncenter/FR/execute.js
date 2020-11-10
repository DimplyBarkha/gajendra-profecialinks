
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'cocooncenter',
    domain: 'cocooncenter.com',
    loadedSelector: '#inner_sections',
    noResultsXPath: '//*[@id="erreur_http"]',
    zipcode: "''",
  },
};
