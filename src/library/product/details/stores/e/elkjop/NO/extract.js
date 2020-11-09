
const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    transform,
    domain: 'elkjop.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
    });
    try {
      await context.waitForSelector('a[id*="tab-more-info-trigger"]', { timeout: 10000 });
      await context.click('a[id*="tab-more-info-trigger"]');
    } catch (error) {
      console.log('more info button click failed!!');
    }
    try {
      await context.waitForSelector('a[id*="tab-specs-trigger"]', { timeout: 10000 });
      await context.click('a[id*="tab-specs-trigger"]');
    } catch (error) {
      console.log('spec button click failed!!');
    }
    try {
      await context.waitForSelector('iframe[id*="quchbox-videolist"]');
    } catch (error) {
      console.log('video iframe is not present');
    }
    await context.evaluate(async function () {
      const videoIframe = document.querySelector('iframe[id*="quchbox-videolist"]');
      try {
        if (videoIframe) {
          const y = videoIframe.contentDocument.documentElement;
          const videoDiv = y.querySelector('ul[class*="b-video-list"]');
          console.log('viddd', videoDiv);
          if (videoDiv) {
            document.body.appendChild(videoDiv);
          }
        }
      } catch (error) {
        console.log('video not fetched');
      }
      function addHiddenDiv (vidurl, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('data-vidurl', vidurl);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addElementToDom (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const productOtherInformation = document.evaluate('//div[contains(@class,"tab-data-row product-more-info")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      productOtherInformation && addElementToDom('pd_productOtherInformation', productOtherInformation.textContent.trim());
      const sku = document.evaluate("//meta[@itemprop='sku']/@content", document, null, XPathResult.STRING_TYPE, null);
      const name = document.evaluate("//meta[@itemprop='name']/@content", document, null, XPathResult.STRING_TYPE, null);
      if (sku && name) {
        const embeedVideos = document.querySelectorAll('video.el-videoplayer');
        if (embeedVideos) {
          for (var i = 0; i < embeedVideos.length; i++) {
            // @ts-ignore
            var urlEmbeedVideo = embeedVideos[i].src;
            addHiddenDiv('vidURL', urlEmbeedVideo);
          }
        }
        var skuS = sku.stringValue;
        var nameS = name.stringValue;
        if (skuS && nameS) {
          const vidApiUrl = `https://dapi.videoly.co/1/videos/0/5/?SKU=${skuS}&productTitle=${nameS}&hn=www.gigantti.fi`;
          const videoApi = await fetch(vidApiUrl,
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              method: 'GET',
            },
          ).then(x => x.json());

          const video = videoApi.items;
          let videoUrl;
          video.forEach(vid => {
            videoUrl = `https://www.youtube.com/watch?v=${vid.videoId}&feature=youtu.be`;
            addHiddenDiv('vidURL', videoUrl);
          });
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
