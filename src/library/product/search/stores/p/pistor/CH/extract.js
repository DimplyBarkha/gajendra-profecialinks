
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'pistor',
    transform,
    domain: 'pistorone.ch',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });

    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('tr[id]');
      for (let i = 0; i < products.length; i++) {
        const productIdElem = products[i].querySelector('td.type-number.field-extartnr span');
        const productId = productIdElem ? productIdElem.textContent : '';
        if (productId) products[i].setAttribute('productid', productId);
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    return await context.extract(productDetails, { transform });
  },

};
