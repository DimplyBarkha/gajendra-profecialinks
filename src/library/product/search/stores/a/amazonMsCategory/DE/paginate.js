
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsCategory',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol/li)] | //*[contains(text(),"Suchen Sie bestimmte Informationen")]',
    openSearchDefinition: {
      template: 'https://www.amazon.de/gp/bestsellers/*/{searchTerms}?_encoding=UTF8&pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.de',
  },
};
