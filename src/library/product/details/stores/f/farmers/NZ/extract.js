const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
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
    await context.evaluate(async () => {
      var src = '';
      const videoEle = document.querySelector('a.phone-thumb-overlay-YouTube');
      if (videoEle) {
        videoEle.click();
        src = document.querySelector('div.ish-product-photo iframe').getAttribute('src');
      }
      if (src) {
        addHiddenDiv('video-url', src);
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
