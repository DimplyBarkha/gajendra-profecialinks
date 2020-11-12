const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: cleanUp,
    domain: 'waitrose.com',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain },
    context,
    { productDetails }) => {
      //remove cookies popup
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const cookies = document.querySelector('div.acceptCookieCTA___NwqHh button');
      if (cookies) cookies.click();
    });

    var detailsPage = await context.evaluate(async () => {
      if (document.querySelector('a[data-origincomponent="ProductPod"]') != null) {
        var productLink = document.querySelector('a[data-origincomponent="ProductPod"]').getAttribute('href');
      }
      return productLink;
    });
    if (detailsPage) {
      await context.goto('https://www.waitrose.com/' + detailsPage);
    }

    // await context.waitForNavigation();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.extract(productDetails);
  },

};
