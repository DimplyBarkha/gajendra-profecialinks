const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform: cleanUp,
    domain: 'samsclub.com',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async () => {
      try {
        await context.waitForSelector('button div[role="presentation"]>img,div[class="sc-pc-image"]>img', { timeout: 60000 });
        console.log('selector for image exist');
      } catch (e) {
        console.log("selector for image doesn't exist");
      }
      const closePopupButton = document.querySelector('div[class*="sc-modal sc-modal-background"]>div button[class*="sc-modal-close"], button[class*=close]');
      if (closePopupButton) {
        // didn't work with context.click() outside context.evaluate()
        // @ts-ignore
        closePopupButton.click();
      }
    });
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 500;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    try {
      await context.waitForSelector('div.syndi_powerpage', { timeout: 20000 });
    } catch (error) {
      console.log('error loading enhanced content' + error);
    }
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('.sc-modal-content > div button');
      if (closePopupButton) {
        // didn't work with context.click() outside context.evaluate()
        // @ts-ignore
        closePopupButton.click();
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      var enhancedContent = document.querySelector('div.syndi_powerpage');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      if (enhancedContent) {
        const enhancedData = document.createElement('div');
        enhancedData && enhancedData.setAttribute('class', 'enhancedContent');
        // @ts-ignore
        enhancedData.innerHTML = enhancedContent.shadowRoot.querySelector('div').innerHTML;
        document.body.appendChild(enhancedData);
      }
      try {
        await context.waitForSelector('iframe[title="Product Videos"]', { timeout: 20000 });
      } catch (element) {
        console.log("iframe selector doesn't exist");
      }
      const iframeElement = document.querySelector('iframe[title="Product Videos"]');
      const iframeDocuments = iframeElement && iframeElement.contentDocument;
      const videoLink = iframeDocuments && iframeDocuments.querySelector('video[class="vjs-tech"]');
      const link = videoLink && videoLink.getAttribute('src');
      const appendElements = document.querySelector('body[class="sc-desktop"]');
      appendElements && appendElements.setAttribute('videolink', link);

      const videoLinkElement = document.querySelector('div[class="sc-image-viewer-vide0-icon"]');
      videoLinkElement && videoLinkElement.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const videoElement = document.querySelector('div[class="sc-video-player"]>div');
      const videoIdValue = videoElement && videoElement.getAttribute('data-video-id');
      const dataAccountValue = videoElement && videoElement.getAttribute('data-account');
      const api = `https://edge.api.brightcove.com/playback/v1/accounts/${dataAccountValue}/videos/${videoIdValue}`;
      const response = await fetch(api, {
        headers: {
          accept: 'application/json;pk=BCpkADawqM0idDDqnhJHEgwzg9BqN7Jb0zPD2DdLYCeuOkUhlBI4ZEX3-tB1U9auAzkOfCao9ga7JLn5GmhfKDtrs8xgEAQhxGGGtxn-P619-JJnECsaWDGqRZMFgBihzDS2c1JZfQm4apaR',
          'accept-language': 'en-US,en;q=0.9',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        method: 'GET',
        mode: 'cors',
      });
      const jsonData = await response.json();
      let VideoLink = '';
      VideoLink = jsonData && jsonData.sources && jsonData.sources[1].src;
      appendElements && appendElements.setAttribute('videolink2', VideoLink);
    });
    return await context.extract(productDetails, { transform });
  },
};
