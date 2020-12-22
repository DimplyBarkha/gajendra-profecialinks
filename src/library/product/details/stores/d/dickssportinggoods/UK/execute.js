module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'dickssportinggoods',
    domain: 'dickssportinggoods.com',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'dsg-flex flex-column rs-header-section')]//h1",
    zipcode: "''",
  },
};
