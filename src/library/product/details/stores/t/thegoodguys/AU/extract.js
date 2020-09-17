const { transform } = require('./shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   implementation: async (inputs,
//     parameters,
//     context,
//     dependencies,
//   ) => {
//   context.evaluate(() => {
//     const iframeLink = document.querySelector('iframe[id="eky-dyson-iframe"]');
//      if(iframeLink){
//       let getLink = iframeLink.getAttribute('src');

//      }
//   });
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   return await context.extract(productDetails, { transform });
// }
// }

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    transform,
    domain: 'thegoodguys.com.au',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const iframeLink = 'iframe[id="eky-dyson-iframe"]';

    const isSelectorAvailable = async (iframeLink) => {
      console.log(`Is selector available: ${iframeLink}`);
      return await context.evaluate(function (iframeLink) {
        return !!document.querySelector(iframeLink);
      }, iframeLink);
    };
    const selectorAvailable = await isSelectorAvailable(iframeLink);

    const getSrc = async (iframeLink) => {
      console.log(`Is selector available: ${iframeLink}`);
      return await context.evaluate(function (iframeLink) {
        return document.querySelector(iframeLink).getAttribute('src');
      }, iframeLink);
    };
         if(selectorAvailable){
          const getData = await getSrc(iframeLink);
          const timeout = parameters.timeout ? parameters.timeout : 30000;
          await context.goto(getData, { timeout, waitUntil: 'load', checkBlocked: true });
          await context.waitForNavigation(getData,{ timeout: 10000, waitUntil: 'load' })
         }

      const { transform } = parameters;
      const { productDetails } = dependencies;
      return await context.extract(productDetails, { transform });
  }
};