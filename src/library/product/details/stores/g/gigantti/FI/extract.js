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

      function addHiddenDiv(id, content) {
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
      let videoLinks = [];
      const iframeVideoNodes = [...document.querySelectorAll('iframe[id*="videolist"]')];
      if (iframeVideoNodes.length > 0) {
        iframeVideoNodes.forEach(iframe => {
          const iframeVideoContents = iframe.contentWindow.document.body;
          const iframeVideo = iframeVideoContents.querySelector('div[class*="video-item"]');
          if (iframeVideo && iframeVideo.hasAttribute('data-videoid')) {
            const videoURL = 'https://www.youtube.com/watch?v=' + iframeVideo.getAttribute('data-videoid');
            console.log('videoURL : ' + videoURL);
            //addHiddenDiv('productVideos', videoURL);
            videoLinks.push(videoURL);
          }
        });
      }

      let prodTitle = document.querySelector('h1.product-title') ? document.querySelector('h1.product-title').textContent.trim() : "";
      prodTitle = encodeURIComponent(prodTitle);
      let brand = document.querySelector('span[itemprop="brand"] meta') && document.querySelector('span[itemprop="brand"] meta').hasAttribute('content') ? document.querySelector('span[itemprop="brand"] meta').getAttribute('content') : "";
      let sku = document.querySelector('p.sku') && document.querySelector('p.sku').hasAttribute('data-product-sku') ? document.querySelector('p.sku').getAttribute('data-product-sku') : "";

      try {
        let apiUrl = `https://dapi.videoly.co/1/videos/0/5/?brandName=${brand}&SKU=${sku}&productId=${sku}&productTitle=${prodTitle}&hn=www.gigantti.fi`
        let prom = await fetch(apiUrl);
        let data = await prom.json();
        console.log(data);
        if (data.items) {
          data.items.forEach(item => {
            if(item.videoId) {
              //addHiddenDiv('productVideos', `https://www.youtube.com/watch?v=${item.videoId}`)
              videoLinks.push(`https://www.youtube.com/watch?v=${item.videoId}`);
            }
          })
        }
      } catch (er) {
        console.log("Encountered an issue with videos API");
      }
      addHiddenDiv('productVideos', videoLinks.join(" | "));
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
