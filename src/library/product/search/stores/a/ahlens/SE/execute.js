
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    domain: 'ahlens.se',
    url: "https://www.ahlens.se/INTERSHOP/web/WFS/Ahlens-AhlensSE-Site/sv_SE/-/SEK/ViewParametricSearch-StaticPage?search=true&SearchTerm=redken",
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
