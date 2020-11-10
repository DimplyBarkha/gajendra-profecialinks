
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'cocooncenter',
    domain: 'cocooncenter.com',
    url: 'https://www.cocooncenter.com/?search={searchTerms}',
    loadedSelector: 'section#listing',
    noResultsXPath: '//div[@id="msg_erreur_listing"]',
    zipcode: "''",
  },
};
