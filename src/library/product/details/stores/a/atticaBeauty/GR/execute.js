
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'GR',
    store: 'atticaBeauty',
    domain: 'atticadps.gr',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'container')]//section[contains(@class,'mainContent')]//div[contains(@class,'errorPage')] | //div[contains(@class,'homepage')]",
    zipcode: "''",
  },
};
