const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'Chronodrive',
    transform,
    domain: 'chronodrive.com',
    zipcode: '91160',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('#footer');
      let articles = document.querySelectorAll('div[id*="productListZone"] > article:not([class*="item--suggest"])');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit && articles && articles.length <= 150) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('#footer');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 2500));
        articles = document.querySelectorAll('div[id*="productListZone"] > article:not([class*="item--suggest"])');
      }
    });
    await new Promise(resolve => setTimeout(resolve, 20000));
    return await context.extract(productDetails, { transform });
  },
};
