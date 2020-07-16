const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot_lg',
    transform,
    domain: 'homedepot.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const RegularSite = await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const nameExtendedSelector = document.querySelector('meta[itemprop="name"]');
      if (!nameExtendedSelector) {
        const nameExtendedSelectorNew = document.querySelector('meta[property="og:title"]');
        const nameExtended = nameExtendedSelectorNew ? nameExtendedSelectorNew.getAttribute('content') : '';
        const newDiv = document.createElement('meta');
        newDiv.setAttribute('itemprop', 'name');
        newDiv.content = nameExtended;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // availability Check
      let availabilityText = 'In Stock';
      const discontinuedMsg = document.evaluate('//span[contains(text(),"Discontinued")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (discontinuedMsg) {
        availabilityText = 'Discontinued';
      }
      const addToCartCheck = document.evaluate('//div[@class="buybelt-wrapper"]//*[normalize-space(text())="Add to Cart"] | //div[@class="buybox"]//*[normalize-space(text())="Add to Cart"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (addToCartCheck) {
        // @ts-ignore
        if (addToCartCheck.parentElement && addToCartCheck.parentElement.disabled) {
          availabilityText = 'Out Of Stock';
        }
      } else {
        availabilityText = 'Out Of Stock';
      }

      addHiddenDiv('custom_availability_text', availabilityText);
      const regularSite = document.querySelector('div#thumbnails');
      async function addVideoUrl (videoId) {
        const videoJson = await fetch(`https://edge.api.brightcove.com/playback/v1/accounts/66036796001/videos/${videoId}`, {
          headers: {
            accept: 'application/json;pk=BCpkADawqM1R4SCVtAbuCMoV8_qAjR72HCIdahKkP_EVYDN5CZrBJIcAnpRv8i1e-btnRvDxRYedYyE9G44ucRGlPepdnvI7oXLRIPxAXyFvLd3W9D1-bEwmIoo',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
          },
          referrer: window.location.origin,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        }).then(r => r.json());
        try {
          const regex = new RegExp(`^https.*${videoId}$`);
          const videoUrl = videoJson.sources.map(({ src }) => src && regex.test(src) && src).filter(Boolean)[0];
          addHiddenDiv(`video_url${videoId}`, videoUrl);
        } catch (error) {
          console.log('video not found');
        }
      }
      if (!regularSite) {
        const imgExpander = document.querySelector('span.mediagallery__thumbnailicons--count');
        if (imgExpander) {
          // @ts-ignore
          imgExpander.click();
        } else {
          // @ts-ignore
          for (const [index, img] of document.querySelectorAll('div[class="mediagallery__thumbnails"] img').entries()) {
            // @ts-ignore
            if (!img.src.includes('videoId')) {
              // @ts-ignore
              addHiddenDiv(`altImage${index}`, img.src);
            } else {
              const videoId = img.getAttribute('src').replace(/.*videoId=(.*$)/, '$1');
              await addVideoUrl(videoId);
            }
          }
        }
        return !!imgExpander;
      } else {
        // @ts-ignore
        for (const video of document.querySelectorAll('div#thumbnails a[data-target="VIDEO"]:not(.media__thumbnail-additional)')) {
          const videoId = video.getAttribute('data-media_id');
          await addVideoUrl(videoId);
        };
      }
    });
    if (RegularSite) {
      try {
        await context.waitForXPath('//div[@class="overlay__side-content__product-images"]//img');
        await context.evaluate(async function () {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
          async function addVideoUrl (videoId) {
            const videoJson = await fetch(`https://edge.api.brightcove.com/playback/v1/accounts/66036796001/videos/${videoId}`, {
              headers: {
                accept: 'application/json;pk=BCpkADawqM1R4SCVtAbuCMoV8_qAjR72HCIdahKkP_EVYDN5CZrBJIcAnpRv8i1e-btnRvDxRYedYyE9G44ucRGlPepdnvI7oXLRIPxAXyFvLd3W9D1-bEwmIoo',
                'accept-language': 'en-US,en;q=0.9',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
              },
              referrer: window.location.origin,
              referrerPolicy: 'no-referrer-when-downgrade',
              body: null,
              method: 'GET',
              mode: 'cors',
              credentials: 'omit',
            }).then(r => r.json());
            try {
              const regex = new RegExp(`^https.*${videoId}$`);
              const videoUrl = videoJson.sources.map(({ src }) => src && regex.test(src) && src).filter(Boolean)[0];
              addHiddenDiv(`video_url${videoId}`, videoUrl);
            } catch (error) {
              console.log('video not found');
            }
          }
          // @ts-ignore
          for (const img of document.querySelectorAll('div[class="overlay__side-content__alt-media"] img')) {
            const videoId = img.getAttribute('src').replace(/.*videoId=(.*$)/, '$1');
            await addVideoUrl(videoId);
          };
        });
      } catch (error) {
        console.log('Error');
      }
    }
    return await context.extract(productDetails, { transform });
  },
};
