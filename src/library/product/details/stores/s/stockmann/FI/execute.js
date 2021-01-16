module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    domain: 'stockmann.com',
    loadedSelector: 'div.main-detail-block',
    noResultsXPath: "/html/body[not(//div[@data-action='Product-Show'])] | //h2[contains(text(),'Palaa takaisin etusivulle. Voit yrittää myöhemmin uudestaan')]",
    zipcode: '',
  },
};
