const { transform } = require('./format');
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "FR",
    store: "intermarche",
    transform,
    domain: "intermarche.com",
    zipcode: "",
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const cssPageNum = '.styled__ProductWrapper-h5dvb4-1.NvJDv';
    await context.waitForSelector(cssPageNum, { timeout: 80000 });
    await context.evaluate(function (parentInput) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const prodUrl = window.location.href.split('product/');
      if (prodUrl[1]) {
        addHiddenDiv('ii_url', prodUrl[1]);
      }
      addHiddenDiv('ii_parentInput', parentInput);
    }, parentInput);
    return await context.extract(productDetails, { transform: transformParam });
  },
};