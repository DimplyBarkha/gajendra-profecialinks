const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    transform,
    zipcode: '',
    domain: 'totalwine.com',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
      const searchUrl = window.location.href;
      const appendElements = document.querySelectorAll('article[class="productCard__2nWxIKmi"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      if (!document.querySelector('#page-num')) {
        addHiddenDiv('page-num', 1);
      } else {
        const pageEl = document.querySelector('#page-num');
        if (pageEl) {
          const currNum = Number(pageEl.textContent) + 1;
          pageEl.textContent = String(currNum);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
