const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'esselungaacasa',
    transform,
    domain: 'esselungaacasa.it',
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
      };
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      };

      const allProducts = document.querySelectorAll('div.content-item[tabindex="0"]');
      for (let x = 0; x < allProducts.length; x++) {
        const productId = allProducts[x].getAttribute('id');
        addElementToDocument(allProducts[x], 'productId', productId);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
