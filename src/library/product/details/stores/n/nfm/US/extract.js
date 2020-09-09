const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'nfm',
    transform,
    domain: 'nfm.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const src = await context.evaluate(async function () {
      const iframeDoc = document.querySelector('#wcframable1-0');
      const iframe = iframeDoc ? iframeDoc.contentDocument : '';
      const src = iframe ? iframe.querySelector('#vjs_video_1_html5_api') ? iframe.querySelector('#vjs_video_1_html5_api').getAttribute('src') : '' : '';
      return src;
    });
    await context.evaluate(async function (src) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('videosExtracted', src);
    }, src);

    return await context.extract(productDetails, { transform });
  },
};
