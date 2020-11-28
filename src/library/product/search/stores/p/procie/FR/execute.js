
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    domain: 'procie.com',
    url: 'https://www.procie.com/resultats-de-recherche.html?Search={searchTerms}',
    loadedSelector: 'div.frameProductList',
    noResultsXPath: '//p[contains(.,"Aucun résultat ne correspond à votre recherche")]',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    console.log('params', parameters);
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
  
    await checkForCloseBtnsAndLoader();
    
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 90000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  
    async function checkForCloseBtnsAndLoader () {
      await context.evaluate(async function (reloadSec, maxTime) {
        let closeBtnElmsXpath = '//button[contains(@title,"Close")]';
        let clostBtnElms = document.evaluate(closeBtnElmsXpath, document, null, 7, null);
    
        async function timeout(ms) {
          console.log('waiting for ' + ms + ' millisecs');
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
    
        if(clostBtnElms && clostBtnElms.snapshotLength > 0) {
          console.log('we have the close buttons to be clicked');
          for(let i = 0; i < clostBtnElms.snapshotLength; i++) {
            console.log('clicking button - ' + i);
            clostBtnElms.snapshotItem(i).click();
            await timeout(3000);
          }
        } else {
          console.log('we never had any popups');
        }
    
        clostBtnElms = document.evaluate(closeBtnElmsXpath, document, null, 7, null);
        if(clostBtnElms && clostBtnElms.snapshotLength > 0) {
          console.log('close btns are still there -- need to update the code');
        } else {
          console.log('all the popups with close buttons are gone');
          console.log('if you still see some on the webpage - check closeBtnElmsXpath');
        }
    
    
        let loaderXpath = '//div[contains(@ng-if,"loadingText")][contains(.,"Chargement des produits")]';
        let loaderElm = document.evaluate(loaderXpath, document, null, 7, null);
        let loaderIsPresent = false;
    
        let count = 0;
        while (loaderElm && loaderElm.snapshotLength > 0) {
          count = count + reloadSec;
          loaderElm = document.evaluate(loaderXpath, document, null, 7, null);
          if (loaderElm && loaderElm.snapshotLength > 0) {
            console.log('loader elements found');
            loaderIsPresent = true;
          } else {
            loaderIsPresent = false;
            break;
          }
          await timeout(reloadSec);
          if (count >= maxTime) {
            console.log('waited for too long');
            break;
          }
        }
        if(loaderIsPresent) {
          console.log('we still have the loader -- page is still loading');
        } else {
          console.log('no more loader');
        }
    
      }, 500, 40000);
    }
  
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
