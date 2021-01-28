// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
// console.log("Do pagination");
// let resultCounter = 0;
// await new Promise(r => setTimeout(r, 8000));

// async function getNumberResultsOnPage() {
//     return await context.evaluate(function() {
//         let resultXPath = "//div[@class='css-1dbjc4n']//div[contains(@class,'r-1pi2tsx')]//a"; // list of items on the page from Shaun
//         let query = document.evaluate(resultXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//         let numberPageResults = query.snapshotLength;
//         console.log(numberPageResults + "results on page")
//         return numberPageResults;
//     });
// }

// async function buttonCheck() {
//      return await context.evaluate(function() {
//         let button = document.querySelector('div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7')
//         if(button != null) {
//             return true;
//         } else {
//             return false;
//         }
//     });
// }

// async function continuedClickToShowResults() {

//         let moreButton = 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7'
//         let numberPageResults = 0;
//         let count = 0
//         while (numberPageResults <= 1000 && count < 200) {

//             if(await buttonCheck()) {
//                 context.click(moreButton)
//                 numberPageResults = await getNumberResultsOnPage();
//                 console.log(numberPageResults + " items on page")
//                 await new Promise(r => setTimeout(r, 10000));
//                 count++
//             } else {
//                 break;
//             }
//         }

// }

// await continuedClickToShowResults()
// }

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    domain: 'cvs.com',
    store: 'cvs',
    nextLinkSelector: 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7',
    // mutationSelector: 'div.css-1dbjc4n.r-13awgt0.r-1wtj0ep',
    spinnerSelector: 'div[role="progressbar"]',
  },
};
