const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    domain: 'mediaexpert.pl',
    zipcode: '',
    noResultsXPath: null,
  },
  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const applyScroll = async function (context) {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      };
      const enhancedConent = document.querySelector('div#description label.a-toggle_label');
      if (enhancedConent) {
        // @ts-ignore
        enhancedConent.click();
        await applyScroll();
      }
    });

    const videoIframes = await context.evaluate(async function () {
      console.log(document.querySelectorAll('div#description div[style] iframe[data-component="lazyLoad"]'));
      return document.querySelectorAll('div#description div[style] iframe[data-component="lazyLoad"]');
    });
    for (let i = 0; i < Object.keys(videoIframes).length; i++) {
      const selector = 'div#description div[style]  iframe';
      const extractedVideoLink = await extractVideosFromEnhancedContent(selector);
      if (extractedVideoLink && extractedVideoLink.includes('youtube')) {
        await appendVideosToDom(extractedVideoLink);
        await removeAddedVideoFromDom(selector);
      }
    }

    async function extractVideosFromEnhancedContent (selector) {
      try {
        const videos = await context.evaluateInFrame(selector,
          function () {
            console.log('start of evaluate');
            const a = document.querySelector('link[rel="canonical"]');
            if (a) {
              return a.getAttribute('href');
            }
          },
        );
        return videos;
      } catch (err) {
        console.log(err);
        return null;
      }
    };

    async function appendVideosToDom (videoLink) {
      await context.evaluate(async function (videoLink) {
        const newDiv = document.createElement('div');
        newDiv.id = 'videoFromEnhancedContent';
        newDiv.textContent = videoLink;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, videoLink);
    }

    async function removeAddedVideoFromDom (videoSelector) {
      await context.evaluate(function (videoSelector) {
        if (videoSelector) {
          const videoEle = document.querySelector(videoSelector);
          if (videoEle) {
            const parentEle = videoEle.parentElement;
            return parentEle ? parentEle.removeChild(videoEle) : null;
          }
        }
      }, videoSelector);
    }
    // const pdp = 'div.c-group.is-container.is-offerGrid > div > div.is-carouselContainer';
    // try{
    //   await context.waitForSelector(pdp, { timeout: 90000 });
    // } catch (error) {
    //   console.log(error.message);
    // }
    return await context.extract(productDetails, { transform: transformParam });
  },
};
