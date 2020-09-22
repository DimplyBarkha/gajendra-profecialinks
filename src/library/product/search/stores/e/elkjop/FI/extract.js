const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'elkjop',
    transform: cleanUp,
    domain: 'gigantti.fi',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
      // @ts-ignore
      const resCountEle = document.querySelector('.count');
      if (resCountEle) {
        // @ts-ignore
        var resCount = resCountEle.innerText;
      }
      const resVisible = 12;
      var iter = Math.ceil(resCount / resVisible);
      var i;
      for (i = 0; i < iter; i++) {
        var elemExist = document.querySelector('#searchProductsInfo');
        if (elemExist) {
          window.scrollTo(0, document.querySelector('#searchProductsInfo').scrollHeight);
          await new Promise((resolve, reject) => setTimeout(resolve, 2000));
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
    return await context.extract(productDetails);
  },
};
