
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: 
    {
    template: 'https://eucs11.ksearchnet.com/cloud-search/n-search/search?ticket=klevu-15488592134928913&term={searchTerms}&paginationStartsFrom={pageOffset}&sortPrice=false&showOutOfStockProducts=true&klevuFetchPopularTerms=false&klevu_priceInterval=500&fetchMinMaxPrice=true&klevu_multiSelectFilters=true&noOfResults=48&klevuSort=rel&enableFilters=true&visibility=search&category=KLEVU_PRODUCT&klevu_filterLimit=50&lsqt=OR&responseType=json#[!opt!]{"type":"json"}[/!opt!]'
    ,pageOffset: 48,
    },
    domain: 'tokmanni.fi',
    zipcode: '',
  },
  // implementation,
};
// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const {
//     nextLinkSelector,
//     mutationSelector,
//     loadedSelector,
//     loadedXpath,
//     spinnerSelector,
//   } = inputs;

//   if (spinnerSelector) {
//     // this may replace the section with a loader
//     await context.click(nextLinkSelector);
//     await context.waitForFunction((selector) => {
//       console.log(selector, document.querySelector(selector));
//       return !document.querySelector(selector);
//     }, { timeout: 40000 }, spinnerSelector);
//     console.log('Spinner went away', spinnerSelector);
//     return true;
//   }

//   if (mutationSelector) {
//     // this may replace the section with a loader
//     await Promise.all([
//       context.click(nextLinkSelector),
//       // possible race condition if the data returned too fast, but unlikely
//       context.waitForMutuation(mutationSelector, { timeout: 60000 }),
//     ]);
//     return true;
//   }

//   if (nextLinkSelector) {
//     console.log('Clicking', nextLinkSelector);
//     const PageNumber = await context.evaluate(async () => {
//       // Method to Retrieve Xpath content of a Single Node
//       const getXpath = (xpath, prop) => {
//         const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
//         let result;
//         if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
//         else result = elem ? elem.singleNodeValue : '';
//         return result && result.trim ? result.trim() : result;
//       };
//       let PageNumber = getXpath("//a[@title='Next']/@href", 'nodeValue');
//       if (PageNumber != null) {
//         return PageNumber.split('(')[1].split(')')[0];
//       }
//     });
//     await context.waitForFunction(()=>{
//       // @ts-ignore
//       klevu_changePage(PageNumber);
//     })
//     // await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 60000 });
//     // if (loadedSelector) {
//     //   await context.waitForSelector(loadedSelector, { timeout: 60000 });
//     // }
//     // if (loadedXpath) {
//     //   await context.waitForXPath(loadedXpath, { timeout: 20000 });
//     // }
//     return true;
//   }
//   return false;
// }