/**
 *
 * @param { { keywords: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */

 async function implementation (
   inputs,
   parameters,
   context,
   dependencies,
 ) {

   function stall(ms) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, ms)
      })
    }

   const url = "https://target.com";
   await dependencies.goto({ url });
   await context.setInputValue("input#search", inputs.keywords);
   await stall(2000);
   await context.evaluate(function() {
      let link = document.querySelector(".TypeaheadItemLink-sc-125kxr2-0");
      if (link != null ) {
          link.click();
      }
    });
   await context.waitForXPath("//ul//li");
   return context.evaluate(function () {
     return document.querySelectorAll('li').length > 0;
   });
   console.log('extracting..');

 }

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'target',
    domain: 'target.com',
    url: 'https://www.target.com/s?searchTerm={searchTerms}',
    loadedSelector: 'div[data-test="productGridContainer"] li',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
  implementation
};
