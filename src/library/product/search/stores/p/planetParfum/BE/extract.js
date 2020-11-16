const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'planetParfum',
    transform,
    domain: 'planetparfum.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      const lastElementToCollect = document.querySelector('li.grid-tile.item-151');
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = lastElementToCollect ? lastElementToCollect.offsetTop : Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('li.grid-tile');
      for (let i = 0; i < products.length; i++) {
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
