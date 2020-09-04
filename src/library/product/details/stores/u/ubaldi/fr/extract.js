
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   await context.evaluate(async function () {
//     const legalDisclaimerClick = document.getElementsByClassName('fa-garanties-legales stat open-popin')[0];
//     if (legalDisclaimerClick !== undefined) {
//       legalDisclaimerClick.click();
//     }
//   });
//   await context.evaluate(async function () {
//     const closeLegalDisclaimer = document.getElementsByClassName('btn btn-default btn-icone bi-suppression bi-gauche')[0];
//     closeLegalDisclaimer.click();
//   });

//   const applyScroll = async function (context) {
//     await context.evaluate(async function () {
//       let scrollTop = 0;
//       while (scrollTop !== 20000) {
//         await stall(500);
//         scrollTop += 1000;
//         window.scroll(0, scrollTop);
//         if (scrollTop === 20000) {
//           await stall(5000);
//           break;
//         }
//       }
//       function stall (ms) {
//         return new Promise((resolve, reject) => {
//           setTimeout(() => {
//             resolve();
//           }, ms);
//         });
//       }
//     });
//   };

//   await applyScroll(context);
// }

const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'fr',
    store: 'ubaldi',
    transform: transform,
    domain: 'ubaldi.com',
    zipcode: "''",
  },
  // implementation,
};
