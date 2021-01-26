/**
 *
 * @param { { keywords: string, zipcode: string, storeID: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ ...inputs, url: destinationUrl });
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.waitForSelector('div.VerifyCityModal__Actions>button.ButtonNext_Theme-Alpha',{timeout:1000});
  await context.click('div.VerifyCityModal__Actions>button.ButtonNext_Theme-Alpha');

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        let countRows=document.querySelectorAll('ul.CategoryProductList-Page>li').length;
        if(countRows>150){
          break;
        }
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
  
  await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    domain: 'technodom.kz',
    url: 'https://www.technodom.kz/search?r46_search_query={searchTerms}',
    loadedSelector: 'main.CategoryPage',
    noResultsXPath: '//div[@class="r46t__results__title__wrap"]/div[@id="r46t-count"]/span[text()=0]',
    zipcode: '',
  },
  implementation
};
