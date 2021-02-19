
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'leclercdrive',
    domain: 'leclercdrive.fr',
    url: 'https://fd5-courses.leclercdrive.fr/magasin-982002-Ajaccio-Centre/recherche.aspx?TexteRecherche={searchTerms}',
    loadedSelector: 'body',
    // noResultsXPath: '//span[@class="WCAD307_FilAriane spanWCAD307_Count"]',
    zipcode: '982002',
  },
};
