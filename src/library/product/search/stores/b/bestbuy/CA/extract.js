const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
  implementation
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
      const element = document.querySelector('footer.globalFooter_Kvg_F ');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
  });
  return await context.extract(productDetails, { transform });
}

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async () => {
//     const loadMore = (document.querySelector('button.loadMore_3AoXT'));
//     // const endOfResult = document.querySelector('div.endOfList_b04RG');
//     if(loadMore){
//      while(loadMore){
//       // @ts-ignore
//       loadMore.click();
//       await new Promise((resolve, reject) => setTimeout(resolve, 2000));
//      }
//     }
//   });
//   return await context.extract(productDetails, { transform });
// }
