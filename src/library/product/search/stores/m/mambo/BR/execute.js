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

  // await new Promise((resolve, reject) => setTimeout(resolve, 30000));
  // const applyScroll = async function (context) {
  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop !== 20000) {
  //       await stall(500);
  //       scrollTop += 500;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //         await stall(5000);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  // };
  // await applyScroll(context);

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
    country: 'BR',
    store: 'mambo',
    domain: 'mambo.com.br',
    url: 'https://www.mambo.com.br/searchresults?Ntt={searchTerms}&Nty=1&No=0&Nrpp=12&Rdm=294&searchType=simple&type=search',
    loadedSelector: '.CC-shelf',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
