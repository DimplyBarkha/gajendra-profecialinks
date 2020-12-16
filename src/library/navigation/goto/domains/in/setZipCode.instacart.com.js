
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'instacart.com',
    store: 'instacart_publix',
    zipcode: '32821',
   },

  // // For navigating from home page to search page because we have to enter the zip code in  home page.
  // implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
  //   const homePage = await context.evaluate(() => document.querySelector('#address_line_1'));
  //   const validZipcode = 32821;
  //   alert("in set zip code.js");
  //   if (homePage) {
  //     await context.evaluate((zipcode) => { document.querySelector('#address_line_1').value = zipcode; }, zipcode);
  //     //let loginButton = document.evaluate("//button[@style='touch-action: manipulation; cursor: pointer; border: 1px solid transparent; border-radius: 4px; font-weight: 600; white-space: normal; user-select: none; -webkit-font-smoothing: antialiased; background-image: none; display: block; align-items: center; padding-left: 24px; padding-right: 24px; font-size: 18px; height: auto; background-color: rgb(67, 176, 42); color: rgb(255, 255, 255); width: 100%; position: relative; font-family: inherit; min-height: 48px; margin: 12px 0px 8px;'", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //     // await context.click(loginButton);
  //     if (zipcode == validZipcode) {
  //       await context.click('//button[@type="submit"]');
  //       alert("zipcode valid");
  //       await context.waitForNavigation();
  //       await context.goto(url, { waitUntil: 'load' });
  //     }
  //   }
  // }
};

