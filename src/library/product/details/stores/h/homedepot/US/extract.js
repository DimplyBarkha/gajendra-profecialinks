const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform,
    domain: 'homedepot.com',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const RegularSite = await context.evaluate(async function () {
      window.scrollTo(0, 1000);
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const scriptXpath = '//script[@type="application/ld+json"][contains(.,"productID") or contains(.,"sku")]';
      let scriptElm = document.evaluate(scriptXpath, document, null, 7, null);

      if (scriptElm.snapshotLength > 0) {
        console.log('got the script for sku and variant id');
        // we are taking the first script element
        let scriptText = scriptElm.snapshotItem(0).textContent.trim();
        let scriptJsonValue = {};
        function isJson(str) {
          try {
              JSON.parse(str);
          } catch (e) {
              return false;
          }
          return true;
        }
        let isScriptJson = isJson(scriptText);
        if(isScriptJson) {
          scriptJsonValue = JSON.parse(scriptText);
          console.log('we have the json from the text ' + scriptJsonValue)
          let sku = '';
          let variantId = '';
          if(scriptJsonValue.hasOwnProperty('sku')) {
            sku = scriptJsonValue.sku;
            console.log('sku - ' + sku);
          } else {
            console.log('we do not have sku in the script json');
          }
          if(scriptJsonValue.hasOwnProperty('productID')) {
            variantId = scriptJsonValue.productID;
            console.log('variantId - ' + variantId);
          } else {
            console.log('we do not have sku in the script json');
          }

          addHiddenDiv('sku', sku);
          addHiddenDiv('variantid', variantId);

        } else {
          console.log('we have the script, but the text cannot be converted to json');
        }

      } else {
        console.log('we did not get the script for sky and variant id -- please try updating - scriptXpath or try with waiting for the script');
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
          //@ts-ignore
          for (const [index, img] of document.querySelectorAll('div[class="overlay__side-content__product-images"] img').entries()) {
            addHiddenDiv(`altImage${index}`, img.src);
          };
        });
      } catch (error) {
        console.log('Error');
      }
    }
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    console.log('waiting....');
    await delay(10000);
    return await context.extract(productDetails, { transform });
  },
};
