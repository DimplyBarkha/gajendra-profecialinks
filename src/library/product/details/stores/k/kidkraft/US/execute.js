
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kidkraft',
    domain: 'kidkraft.com',
    loadedSelector: 'div.fotorama__loaded--img img',
    noResultsXPath: "//div[contains(@class,'message notice')]//div/text()",
    zipcode: "''",
  },
};
