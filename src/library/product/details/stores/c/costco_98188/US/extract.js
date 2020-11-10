const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    domain: 'costco.com',
    transform,
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const descNode = document.querySelector('div.product-info-description');
      try {
        var parentNode = document.getElementsByClassName('syndi_powerpage');
        if (parentNode && parentNode.length && parentNode[0].shadowRoot) {
          var shadowRoot = parentNode[0].shadowRoot;
          if (shadowRoot && shadowRoot.querySelector('video')) {
            var videoEle = shadowRoot.querySelector('video');
            videoEle.click();
            if (videoEle && videoEle.getAttribute('src')) {
              addHiddenDiv('product-video', videoEle.getAttribute('src'));
            }
          }
        }
      } catch (e) {
      }
      if (descNode && descNode.innerText) {
        addHiddenDiv('product-desc', descNode.innerText);
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
