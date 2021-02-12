
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    nextLinkSelector: 'li[class=""] a.linkNext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.SearchScreen_Results.col-sm-9 > div,div.image-gallery-slides',
    noResultsXPath: '//div[@class="NoResultsView_Body col-sm-9"]//h1',
    openSearchDefinition:null,
    // openSearchDefinition: {
    //   pageIndexMultiplier: 20,
    //   template: 'https://www.cromwell.co.uk/shop?familiesDisplayed=20&familySkip={index}&page={page}&query={searchTerms}'
    // },
    domain: 'cromwell.co.uk',
    zipcode: '',
  },
  // implementation:async function  (
  //   inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) {
  //   const { keywords, page, offset,date,id } = inputs;
  //   const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;
  
  //   if (nextLinkSelector) {
  //     const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
  //     if (!hasNextLink) {
  //       return false;
  //     }
  //   }
  
  //   const { pager } = dependencies;
  //   const success = await pager({ keywords, nextLinkSelector, loadedSelector, mutationSelector, spinnerSelector });
  //   if (success) {
  //     return true;
  //   }
  
  //   let url = await context.evaluate(function () {
  //     /** @type { HTMLLinkElement } */
  //     const next = document.querySelector('head link[rel="next"]');
  //     if (!next) {
  //       return false;
  //     }
  //     return next.href;
  //   });
  
  //   if (!url && openSearchDefinition) {
  //     const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
  //     const pageNb = page + pageStartNb - 1;
  //     url = template
  //       .replace(/{searchTerms}/g, encodeURIComponent(keywords))
  //       .replace(/{id}/g, encodeURIComponent(id))
  //       .replace(/{date}/g, encodeURIComponent(date))
  //       .replace(/{page}/g, (pageNb + (pageOffset || 0)).toString())
  //       .replace(/{index}/g, (pageNb * (pageIndexMultiplier || 0)).toString())
  //       .replace(/{offset}/g, (offset + (indexOffset || 0)).toString());
  
  
  //   }
  
  //   if (!url) {
  //     return false;
  //   }
  
  //   console.log('Going to url', url);
  //   await dependencies.goto({ url });
  //   if (loadedSelector) {
  //     await context.waitForFunction(function (sel, xp) {
  //       return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //     }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  //   }
  //   console.log('Checking no results', noResultsXPath);
  //   return await context.evaluate(function (xp) {
  //     const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  //     console.log(xp, r);
  //     const e = r.iterateNext();
  //     console.log(e);
  //     return !e;
  //   }, noResultsXPath);
 // }
  
};
