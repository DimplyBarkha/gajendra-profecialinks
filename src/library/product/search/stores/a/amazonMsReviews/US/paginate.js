/**
 *
 * @param { { url?: string,  id?: string, _date?: string } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
 async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
 ) {
   const { id, _date} = inputs;
   const nextLinkSelector = 'ul.a-pagination>li.a-last a';
   const loadedSelector = 'div[data-hook=review]';
   const noResultsXPath = '//div[contains(@class, "no-reviews-section")]';

  async function checkDate () {
      const reviewDateRaw = document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]') ? document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]').innerText :  ''
      const topReviewDate = new Date(reviewDateRaw)
      if(topReviewDate){
        let month = '' + (topReviewDate.getMonth() + 1);
        let day = '' + topReviewDate.getDate();
        let year = topReviewDate.getFullYear();
        return `${[year, month, day].join('-')}`;
      }else{
        return false
      }
  }

  if((new Date(await context.evaluate(checkDate)).valueOf() - new Date(_date).valueOf())<0){
    return false;
  }else{
    if (nextLinkSelector) {
      const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
      if (!hasNextLink) {
        return false;
      }
    }
  }

   const { pager } = dependencies;
   const success = await pager({ nextLinkSelector, loadedSelector });
   if (success) {
     return true;
   }
 
   let url = await context.evaluate(function () {
     /** @type { HTMLLinkElement } */
     const next = document.querySelector('head link[rel="next"]');
     if (!next) {
       return false;
     }
     return next.href;
   });
 
   if (!url) {
     return false;
   }
   console.log('GOING to url', url);
   await dependencies.goto({ url });
   if (loadedSelector) {
     await context.waitForFunction(function (sel, xp) {
       return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
     }, { timeout: 10000 }, loadedSelector, noResultsXPath);
   }
   console.log('Checking no results', noResultsXPath);
   return await context.evaluate(function (xp) {
     const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
     console.log(xp, r);
     const e = r.iterateNext();
     console.log(e);
     return !e;
   }, noResultsXPath);
 }
 
 module.exports = {
   parameters: [
     {
       name: 'country',
       description: '2 letter ISO code for the country',
     },
     {
       name: 'store',
       description: 'store name',
     },
     {
       name: 'nextLinkSelector',
       description: 'CSS selector for the next link',
     },
     {
       name: 'mutationSelector',
       description: 'CSS selector for what to wait to change (if in-page pagination)',
     },
     {
       name: 'spinnerSelector',
       description: 'CSS selector for a spinner to wait to disappear (if in-page pagination)',
     },
     {
       name: 'loadedSelector',
       description: 'CSS to tell us the page has loaded',
     },
     {
       name: 'noResultsXPath',
       description: 'XPath selector for no results',
     },
     {
       name: 'openSearchDefinition',
       description: 'Open search definition object',
     },
   ],
   inputs: [{
      name: '_date',
      description: 'date of last review extracted',
    }, {
      name: 'id',
      description: 'offset (0 indexed)',
    }],
   path: './stores/${store[0:1]}/${store}/${country}/paginate',
   dependencies: {
     pager: 'action:product/search/paginate/pager',
     goto: 'action:navigation/goto',
   },
   implementation,
 };
 