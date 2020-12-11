const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    transform,
    domain: 'gigantti.fi',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      if (document.querySelector('button[class*="banner__accept"]')) {
        document.querySelector('button[class*="banner__accept"]').click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const secImages = document.querySelectorAll('div[class*="slick-slide"] img');
      // let finalSecImages=[];
      for (let i = 0; i < secImages.length; i++) {
        console.log(secImages[i].getAttribute('src') + ' is secondary image');
        const tempSrc = secImages[i].getAttribute('src');
        if (tempSrc !== null && !tempSrc.includes('/tubby')) {
        // if(!secImages[i].getAttribute('src').includes('/tubby')){
          addHiddenDiv('secondaryImages', tempSrc);
        }
      }

      const overlay = document.getElementById('tab-more-info-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }

      const iframeVideoNodes = [...document.querySelectorAll('iframe[id*="videolist"]')];
      if (iframeVideoNodes.length > 0) {
        iframeVideoNodes.forEach(iframe => {
          const iframeVideoContents = iframe.contentWindow.document.body;
          const iframeVideo = iframeVideoContents.querySelector('div[class*="video-item"]');
          if (iframeVideo && iframeVideo.hasAttribute('data-videoid')) {
            const videoURL = 'https://www.youtube.com/watch?v=' + iframeVideo.getAttribute('data-videoid');
            console.log('videoURL : ' + videoURL);
            addHiddenDiv('productVideos', videoURL);
          }
        });
      }
    });

    await context.evaluate(async function () {
      const overlay = document.getElementById('tab-specs-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
