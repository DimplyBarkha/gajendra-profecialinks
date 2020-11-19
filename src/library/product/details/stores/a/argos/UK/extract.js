const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    transform,
    domain: 'argos.co.uk',
    zipcode: 'SE19PD',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const defaultTimeOutInMS = 10000;

    const preparePage = async () => {
      await context.waitForNavigation({ timeout: defaultTimeOutInMS, waitUntil: 'networkidle0' });

      try {
        await context.waitForSelector('span[data-test="product-title"]', { timeout: defaultTimeOutInMS });
      } catch (err) {
        throw new Error('Product not found/Not a product page.');
      }

      try {
        console.log('Clicking on cookies button.');
        await context.waitForSelector('.privacy-prompt-footer a', { timeout: defaultTimeOutInMS });
        await context.evaluate(function () {
          document.querySelector('.privacy-prompt-footer a').click();
        });
      } catch (err) {
        console.log('Clicking on cookies button failed.');
      }

      await context.evaluate(async function (zip) {
        const delay = t => new Promise(resolve => setTimeout(resolve, t));

        const injectElementToBody = (id, value, isHtmlContent) => {
          const elem = document.createElement('div');

          elem.id = id;
          if (isHtmlContent) {
            elem.innerHTML = value;
          } else {
            elem.innerText = value;
          }

          document.body.appendChild(elem);
        };

        const buildDescription = (addDesc = false) => {
          const description = document.querySelector('div[itemprop="description"]');
          const subNodes = description.querySelectorAll('*');
          let text = '';
          let addDescTxt = '';
          subNodes.forEach(subNode => {
            const listItems = subNode.querySelectorAll('li');
            if (listItems && listItems.length) {
              listItems.forEach(list => {
                text += `||${list.textContent}`;
                addDescTxt += `||${list.textContent}`;
              });
            } else if (subNode.nodeName.toLowerCase() !== 'li' && subNode.nodeName.toLowerCase() !== 'ul') {
              text += `${subNode.textContent}`;
            }
          });

          if (addDesc) {
            return addDescTxt.trim();
          }

          return text.trim();
        };

        const makeApiCall = async (url, options) => {
          try {
            console.log(`Making API call to => ${url}`);
            if (!options) {
              options = {
                mode: 'no-cors',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
              };

              return await (await fetch(url, options)).json();
            }

            return await (await fetch(url, options)).text();
          } catch (err) {
            console.log('Error while making API call.', err);
          }
        };

        injectElementToBody('description', buildDescription());
        injectElementToBody('addition-description', buildDescription(true));

        // Gather product attributes
        const productInfo = (window.__data && window.__data.productStore && window.__data.productStore.data && window.__data.productStore.data) || {};

        const offers = (productInfo && productInfo.offers) || [];
        offers.forEach((offer, index) => {
          let offerText = (offer.attributes && offer.attributes.longDescription) || '';
          if (offer.attributes && offer.attributes.totalFromPrice) {
            offerText += ` From: ${offer.attributes.totalFromPrice}`;
          }
          injectElementToBody(`offer-text-${++index}`, offerText);
        });

        const brand = (productInfo && productInfo.attributes && productInfo.attributes.brand) || '';
        injectElementToBody('brand', brand);

        const images = (productInfo && productInfo.media && productInfo.media.images) || [];
        images.forEach((img, index) => {
          // Skip the first image
          if (index) {
            injectElementToBody(`image-${index}`, `${img}`);
          }
        });

        const videos = (productInfo && productInfo.media && productInfo.media.videos) || [];
        videos.forEach((vid, index) => {
          injectElementToBody(`video-${++index}`, (vid.includes('mp4') || vid.includes('m4v')) ? `${vid}` : `${vid}/mp4_480p`);
        });

        const variants = (productInfo && productInfo.variants.attributes && productInfo.variants.attributes.variants) || [];
        variants.forEach((variant, index) => {
          injectElementToBody(`variant-${++index}`, `${variant.partNumber}`);
        });

        const sku = document.querySelector('span[itemprop="sku"]').getAttribute('content');

        const aplusUrl = `https://ws.cnetcontent.com/d90c7492/script/86f5427d30?cpn=${sku}&lang=en_gb&market=UK&host=www.argos.co.uk&nld=1`;
        let aplusResponse = await makeApiCall(aplusUrl, {});

        if (aplusResponse) {
          aplusResponse = 'window.ccs_cc_loadQueue = [];' + aplusResponse;
          /* eslint no-eval: 0 */
          eval(aplusResponse);
          const clonedInfo = JSON.parse(JSON.stringify(window.ccs_cc_loadQueue));
          console.log('aplusResponse', clonedInfo);
          const aplusHtml = (clonedInfo && clonedInfo.length && clonedInfo[0] && clonedInfo[0].htmlBlocks && clonedInfo[0].htmlBlocks.length && clonedInfo[0].htmlBlocks[0].html) || '';

          injectElementToBody('manufacturer-details', aplusHtml, true);
        }

        // return sku;

        const getAvailability = async () => {
          const url = `https://www.argos.co.uk/stores/api/orchestrator/v0/cis-locator/availability?maxDistance=50&maxResults=10&skuQty=${sku}_1&channel=web_pdp&timestamp=${new Date().getTime()}&postcode=${zip}`;
          const response = await makeApiCall(url);
          if (!response) {
            throw new Error('Availability Check Failed');
          }
          console.log('availability', response);

          const availability = (response && response.stores && response.stores[0] && response.stores[0].messages && response.stores[0].messages[sku] && response.stores[0].messages[sku].messageKey) || '';
          injectElementToBody('availability', availability);
        };

        const retryAction = async (retryLimit = 5) => {
          let retryCount = 0;
          let evaluationState = false;
          while (retryCount < retryLimit && !evaluationState) {
            try {
              ++retryCount;
              console.log(`Try number => ${retryCount}`);
              await getAvailability();
              evaluationState = true;
            } catch (err) {
              console.log('Action failed, waiting for a while before retry.');
              await delay(retryCount * 3000);

              if (retryCount === retryLimit) {
                console.log(`Failed to get availability after ${retryLimit} retries.`);
                throw new Error(`Failed to get availability after ${retryLimit} retries.`);
              }
            }
          }
        };

        await retryAction(3);
      }, parameters.zipcode);
    };

    try {
      await preparePage();
      await context.waitForSelector('div#availability', { timeout: defaultTimeOutInMS });
    } catch (err) {
      console.log('Availability did not load.');
      await context.evaluate(function () {
        window.location.reload();
      });
      // await context.goto(url, {timeout: defaultTimeOutInMS, waitUntil: 'load', checkBlocked: true});
      await preparePage();
    }

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
