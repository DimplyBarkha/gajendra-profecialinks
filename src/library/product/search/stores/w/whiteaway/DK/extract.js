const { transform } = require('../../../../shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   let promise = new Promise((resolve, reject) => {
//     setTimeout(() => resolve("done!"), 10000)
//   });

//   let result = await promise; // wait until the promise resolves (*)

  // console.log(result); // "done!"
  // window.scrollBy(0, 10000);
  // console.log("Test");
  // return context.extract(productDetails, { transform });
  

// }

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    transform: transform,
    domain: 'whiteaway.com',
  },
};
