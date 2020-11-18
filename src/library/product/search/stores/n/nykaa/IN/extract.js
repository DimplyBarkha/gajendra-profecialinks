const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform,
    domain: 'nykaa.com',
    zipcode: '',
  },
  //   implementation: async function implementation (
  //     inputs,
  //     parameters,
  //     context,
  //     dependencies,
  //   ) {
  //     const { transform } = parameters;
  //     const { productDetails } = dependencies;
  //     try {
  //       await context.evaluate(() => {
  //         document.querySelector('.card-wrapper-container:last-child').scrollIntoView()
  //       })
  //       await context.waitForXPath('//div[contains(@class,"card-wrapper-container")]//img/@src')
  //       const delay = t => new Promise(resolve => setTimeout(resolve, t));
  //       await delay(40000);
  //      // await context.evaluate(() => {
  //      //   document.querySelector('.view-more-btn').scrollIntoView()
  //      // })
  //      await context.waitForSelector('.view-more-btn')
  //      for (let i = 0; i < 6; i++ )
  //      {
  //       await context.click('.view-more-btn')
  //       await context.waitForXPath('//div[contains(@class,"card-wrapper-container")]//img/@src')
  //       const delay = t => new Promise(resolve => setTimeout(resolve, t));
  //       await delay(20000);
  //      }
  //     } catch (e) {
  //       console.log(e.message)
  //     }

//     return await context.extract(productDetails, { transform });
//   }
};
