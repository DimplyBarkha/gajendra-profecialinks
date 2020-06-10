// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { productDetails } = dependencies;
//   // const { transform } = parameters;

//   async function getMaxClicks () {
//     return await context.evaluate(() => {
//       const totalResults = document.evaluate('//h1[@class="showing___20A1_"]/text()[2]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.trim();
//       const resultPerLoad = document.querySelectorAll('article.productPod___1NmFb').length;
//       if (Number(totalResults) > Number(resultPerLoad)) {
//         const roundoff = Math.round(Number(totalResults) / Number(resultPerLoad)) - 1;
//         return roundoff;
//       }
//     });
//   }

//   async function getButton () {
//     return await context.evaluate(() => {
//       const buttonInfo = document.querySelector('div.loadMoreWrapper___UneG1 > button');
//       return buttonInfo;
//     });
//   }

//   let maxClicks = await getMaxClicks();
//   let button = await getButton();

//   while (maxClicks > 0) {
//     if (button = !null) {
//       await context.click('div.loadMoreWrapper___UneG1 > button');
//       await timeout(30000);
//       maxClicks--;
//     }
//   }

//   async function timeout (ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   return await context.extract(productDetails);
// }
// module.exports = {
//   implements: 'product/search/extract',
//   parameterValues: {
//     country: 'UK',
//     store: 'waitrose',
//     transform: null,
//     domain: 'waitrose.com',
//   },
//   implementation,
// };

const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: transform,
    domain: 'waitrose.com',
  },
};
