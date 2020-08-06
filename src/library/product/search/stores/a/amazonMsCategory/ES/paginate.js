
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsCategory',
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Buscas algo")] | /html[not(//ol/li)]',
    openSearchDefinition: {
      template: 'https://www.amazon.es/gp/bestsellers/*/{searchTerms}?&pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.es',
    zipcode: '',
  },
};
