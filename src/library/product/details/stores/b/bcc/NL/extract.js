const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    transform,
    domain: 'bcc.nl',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const RegularSite = await context.evaluate(async function () {
      
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function getUrl() {
        return window.location.href;
      }

      function getDate() {
        return new Date().toISOString();
      }

      addHiddenDiv('current-page-url', getUrl());
      addHiddenDiv('page-timestamp', getDate());
    });
    // if (RegularSite) {
    //   try {
    //     await context.waitForXPath('//div[@class="overlay__side-content__product-images"]//img');
    //     await context.evaluate(async function () {
    //       function addHiddenDiv (id, content) {
    //         const newDiv = document.createElement('div');
    //         newDiv.id = id;
    //         newDiv.textContent = content;
    //         newDiv.style.display = 'none';
    //         document.body.appendChild(newDiv);
    //       }
    //       async function addVideoUrl (videoId) {
    //         const videoJson = await fetch(`https://edge.api.brightcove.com/playback/v1/accounts/66036796001/videos/${videoId}`, {
    //           headers: {
    //             accept: 'application/json;pk=BCpkADawqM1R4SCVtAbuCMoV8_qAjR72HCIdahKkP_EVYDN5CZrBJIcAnpRv8i1e-btnRvDxRYedYyE9G44ucRGlPepdnvI7oXLRIPxAXyFvLd3W9D1-bEwmIoo',
    //             'accept-language': 'en-US,en;q=0.9',
    //             'sec-fetch-dest': 'empty',
    //             'sec-fetch-mode': 'cors',
    //             'sec-fetch-site': 'cross-site',
    //           },
    //           referrer: window.location.origin,
    //           referrerPolicy: 'no-referrer-when-downgrade',
    //           body: null,
    //           method: 'GET',
    //           mode: 'cors',
    //           credentials: 'omit',
    //         }).then(r => r.json());
    //         try {
    //           const regex = new RegExp(`^https.*${videoId}$`);
    //           const videoUrl = videoJson.sources.map(({ src }) => src && regex.test(src) && src).filter(Boolean)[0];
    //           addHiddenDiv(`video_url${videoId}`, videoUrl);
    //         } catch (error) {
    //           console.log('video not found');
    //         }
    //       }
    //       // @ts-ignore
    //       for (const img of document.querySelectorAll('div[class="overlay__side-content__alt-media"] img')) {
    //         const videoId = img.getAttribute('src').replace(/.*videoId=(.*$)/, '$1');
    //         await addVideoUrl(videoId);
    //       };
    //     });
    //   } catch (error) {
    //     console.log('Error');
    //   }
    // }
    return await context.extract(productDetails, { transform });
  }
};
