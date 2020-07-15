
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsCategory',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
<<<<<<< HEAD
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Suchen Sie bestimmte Informationen")]| /html[not(//ol/li)]',
=======
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol/li)] | //*[contains(text(),"Suchen Sie bestimmte Informationen")]',
>>>>>>> 8306ea7d6e5682548478097d8955c1e4bdbc1e19
    openSearchDefinition: {
      template: 'https://www.amazon.de/gp/bestsellers/*/{searchTerms}?_encoding=UTF8&pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.de',
  },
};
