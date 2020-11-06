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
    // await context.waitForSelector('div.product-info-description');
    const videoEle = await context.evaluate(async () => {
      var videoEle = false;
      const iframeNode = document.querySelectorAll('.wc-ribbon-button');
      // const testNode = document.querySelectorAll('iframe.data-iframe-viewed');
      if (iframeNode.length) {
        iframeNode.forEach((ele) => {
          var videoAttr = ele.getAttribute('data-wc-open-content-type')
          if (videoAttr && videoAttr === 'video-gallery') {
            videoEle = true;
          }
        });
      }
      return videoEle;
    });
    if (videoEle) {
      await context.waitForSelector('div#vjs_video_1 video');
    }
    await context.evaluate(async () => {
      const descNode = document.querySelector('div.product-info-description');
      const videoNode = document.querySelectorAll('div#vjs_video_1 video');
      if (videoNode.length) {
        if (videoNode[0].getAttribute('src')) {
          addHiddenDiv('product-video', videoNode[0].getAttribute('src'));
        }
      }
      if (descNode && descNode.innerText) {
        addHiddenDiv('product-desc', descNode.innerText)
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
