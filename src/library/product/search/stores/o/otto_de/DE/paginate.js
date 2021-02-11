
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    //nextLinkSelector: '#san_pagingBottomNext > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="content contentWithSidebar"]',
    noResultsXPath: null,
    openSearchDefinition: {
      //offset: 20,
      template: 'https://www.otto.de/suche/{searchTerms}/?l=gq&o={offset}',
    },
    domain: 'otto.de',
    zipcode: '',
  },
//  implementation,
};
// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { id, date, keywords, page, offset } = inputs;
//   const { nextPageUrlSelector, stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;

//   let nextLink;

//   if (stopConditionSelectorOrXpath) {
//     const conditionIsTrue = await context.evaluate((sel) => {
//       try {
//         const isThere = document.querySelector(sel);
//         return !!isThere;
//       } catch (error) {
//         try {
//           const isThere = document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
//           return !!isThere;
//         } catch (error) {
//           return false;
//         }
//       }
//     }, stopConditionSelectorOrXpath);
//     // @ts-ignore
//     if (conditionIsTrue) return false;
//   }

//   if (nextLinkSelector) {
//     const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
//     if (!hasNextLink) return false;
//     nextLink = nextLinkSelector;
//   }

//   if (nextLinkXpath) {
//     // add a unique ID to the elem so it can be targeted by css
//     const uuid = Date.now().toString(36) + Math.random().toString(36).substr(2);
//     const hasNextLink = await context.evaluate(({ selector, uuid }) => {
//       const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
//       if (elem && elem.singleNodeValue && elem.singleNodeValue.nodeType === 1) { // check the node type is element
//         // @ts-ignore
//         elem.singleNodeValue.id = uuid;
//         return true;
//       }
//       return false;
//     }, { selector: nextLinkXpath, uuid });
//     if (!hasNextLink) return false;
//     nextLink = `#${uuid}`;
//   }
//   const { pager } = dependencies;

//   const success = openSearchDefinition ? false : await pager({ ...inputs, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });

//   if (success) {
//     return true;
//   }

//   let url = openSearchDefinition ? false : await context.evaluate((nextSelectors) => {
//     const selector = nextSelectors.filter(u => u).join(', ');
//     const next = document.querySelector(selector);
//     if (!next) return false;
//     return next.href;
//   }, [nextPageUrlSelector, 'head link[rel="next"]']);

//   //Edits to add custom JS


//   const productoffset = await context.evaluate(async () => {
//     const getAllXpath = (xpath, prop) => {
//       const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//       const result = [];
//       for (let index = 0; index < nodeSet.snapshotLength; index++) {
//         const element = nodeSet.snapshotItem(index);
//         if (element) result.push(prop ? element[prop] : element.nodeValue);
//       }
//       return result;
//     };
//     let arr = [];
//     const rawData = getAllXpath('//script[@type="application/ld+json"]', 'nodeValue');
//     var startat = rawData.length;
//     arr.push(startat);
//     // @ts-ignore
//     const stopat = parseInt(document.querySelector('span[class="item"] strong').innerText.replace('(', '').replace(')', ''))
//     arr.push(stopat);
//     return arr;
//   });


//   if (!url && openSearchDefinition) {
//     const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
//     const pageNb = page + pageStartNb - 1;
//     if (offset < productoffset[1]) {
//       url = template
//         .replace(/{searchTerms}/g, encodeURIComponent(keywords))
//         .replace(/{id}/g, encodeURIComponent(id))
//         .replace(/{date}/g, encodeURIComponent(date))
//         .replace(/{page}/g, (pageNb + (pageOffset || 0)).toString())
//         .replace(/{index}/g, (pageNb * (pageIndexMultiplier || 0)).toString())
//         .replace(/{offset}/g, (offset).toString());
//     }
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
//   if (loadedXpath) {
//     await context.waitForFunction(function (sel, xp) {
//       return Boolean(document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
//     }, { timeout: 10000 }, loadedXpath, noResultsXPath);
//   }
//   console.log('Checking no results', noResultsXPath);

//   if (resultsDivSelector) {
//     // counting results
//     const resultNB = await context.evaluate(sel => document.querySelectorAll(sel).length, resultsDivSelector);
//     console.log(`The page has: ${resultNB} results. Pagination continues: ${!!resultNB}`);
//     return !!resultNB;
//   }

//   return await context.evaluate(function (xp) {
//     const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
//     const e = r.iterateNext();
//     return !e;
//   }, noResultsXPath);
// }