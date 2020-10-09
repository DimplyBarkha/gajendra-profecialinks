const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    transform: transform,
    domain: 'elkjop.no',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
      const resCount = document.querySelector('.count');
      // @ts-ignore
      if (resCount && resCount.innerText) {
        const resVisible = 12;
        // @ts-ignore
        var iter = Math.ceil(resCount.innerText / resVisible);
        var i;
        for (i = 0; i < iter; i++) {
          if (document.querySelector('#searchProductsInfo')) {
            window.scrollTo(0, document.querySelector('#searchProductsInfo').scrollHeight);
            await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          }
        }
      }
    });
    await context.evaluate(async function () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const arr = document.querySelectorAll('div.mini-product');
      for (let i = 0; i < arr.length; i++) {
        addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
    });
    return await context.extract(productDetails, { transform });
  },
};
