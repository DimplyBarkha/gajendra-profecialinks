/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    try{
      await context.waitForSelector('div.expandablePanel__ExpandedPanelContent-sc-1dj0gc8-2.ktiyNu.fade__Fade-fp5b7c-0.gPofqU > button.styled__DeprecatedStyledLink-xb32ls-0.eHOXHK.expandableContentWrapper__ShowMoreButton-aorfkp-0.gRHpPQ',{timeout:500});
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      await context.click('div.expandablePanel__ExpandedPanelContent-sc-1dj0gc8-2.ktiyNu.fade__Fade-fp5b7c-0.gPofqU > button.styled__DeprecatedStyledLink-xb32ls-0.eHOXHK.expandableContentWrapper__ShowMoreButton-aorfkp-0.gRHpPQ');
      await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    }catch(e){
  
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    try{
      await context.waitForSelector('div.expandablePanel__ExpandedPanelContent-sc-1dj0gc8-2.ktiyNu.fade__Fade-fp5b7c-0.gPofqU > button[data-test="showMoreButton-specifications"].styled__DeprecatedStyledLink-xb32ls-0.eHOXHK.expandableContentWrapper__ShowMoreButton-aorfkp-0.gRHpPQ',{timeout:500});
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      await context.click('div.expandablePanel__ExpandedPanelContent-sc-1dj0gc8-2.ktiyNu.fade__Fade-fp5b7c-0.gPofqU > button[data-test="showMoreButton-specifications"].styled__DeprecatedStyledLink-xb32ls-0.eHOXHK.expandableContentWrapper__ShowMoreButton-aorfkp-0.gRHpPQ');
      await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    }catch(e){
  
    }
    
  
  
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
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

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 100000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    domain: 'galaxus.ch',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
  implementation
};
