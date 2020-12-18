
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: null,
    domain: 'dm.de',
    zipcode: '',
  },
//  implementation
};
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productReviews } = dependencies;

//   // to close random popups
//   const closeRandomPopups = await context.evaluate(function () {
//     return !!document.evaluate('//button[@data-dmid="layer-header-close-button"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//   });
//   if (closeRandomPopups) {
//     await context.click('button[data-dmid="layer-header-close-button"]');
//   }

//   // to close cookies popup on all products
//   const closeCookiesPopup = await context.evaluate(function () {
//     return !!document.evaluate('//button[@data-dmid="cookiebar-ok"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//   });
//   if (closeCookiesPopup) {
//     await context.click('button[data-dmid="cookiebar-ok"]');
//   }
//   await context.evaluate(async function () {
//     let scrollTop = 0;
//     while (scrollTop !== 20000) {
//       await stall(500);
//       scrollTop += 1000;
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

//   await new Promise(resolve => setTimeout(resolve, 12000));
//   return await context.extract(productReviews);
// }
