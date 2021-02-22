/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
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
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  try{
    await context.waitForSelector('div.cookiesModal-footer-buttons>button.js-cookies-accept-all',{timeout:1000});
    await context.click('div.cookiesModal-footer-buttons>button.js-cookies-accept-all');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch(e){

  }
  

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        let countRows=document.querySelectorAll('div.pageBody-content ul.ProductList>li').length;
        if(countRows>150){
          break;
        }
        document.querySelector('div.pageBody-content ul.ProductList:last-child').scrollIntoView();
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
        
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  if (parameters.loadedSelector) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_fr',
    domain: 'delhaize.be',
    url: 'https://www.delhaize.be/fr-be/shop/search?q={searchTerms}',
    loadedSelector: 'div.ProductSearchResultsPage',
    noResultsXPath: '//div[@class="ResultAmount-container"]/span[@class="ResultAmount" and starts-with(text(),"0 résultats pour")]',
    zipcode: '',
  },
  implementation
};
