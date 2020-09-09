
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    transform: transform,
    domain: 'farmers.co.nz',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const brandUrl = await context.evaluate(async () => {
      const brandUrlArr = document.querySelectorAll('div.filter-container a');
      console.log('BrandUrl', brandUrlArr);
      if (brandUrlArr) {
        for (let i = 0; i < brandUrlArr.length; i++) {
          const brandLink = brandUrlArr[i].href;
          if (brandLink.includes('brandslisting')) {
            console.log('brandLink', brandUrlArr);
            return brandLink;
          }
        }
      }
    });
    if (brandUrl) {
      await context.goto(brandUrl);
    }

    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const searchUrl = window.location.href;
      addHiddenDiv('added-searchurl', searchUrl);
    });
    return await context.extract(productDetails, { transform });
  },
};
