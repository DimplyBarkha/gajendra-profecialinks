module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    domain: 'intermarche.fr',
    url: 'https://www.intermarche.com/rechercheproduits/02111/recherche/{cookies}/filtres/[]',
    loadedSelector: 'div.styled__ProductGridWrapper-sc-15s6tne-0.bLxuUB',
    noResultsXPath: '//div[contains(@class,"NoResultText")]',
  },
};
