const { transform } = require("../transform");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'o2',
    transform,
    domain: 'o2.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails: data }) => {
    const { transform } = parameters;
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        addHiddenDiv('custom-product-video-url', window.deviceJson.videoUrl);
        addHiddenDiv('custom-product-color-code', window.deviceJson.selectedColourCode);
        addHiddenDiv('custom-product-url', document.URL);
      } catch (error) {
        console.log('Error: ', error);
      }
    })
    return await context.extract(data, { transform });
  }
};
