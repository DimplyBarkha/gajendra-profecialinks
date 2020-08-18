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
  implementation: async (inputs, parameters, context, dependencies, ) => {
    const defaultTimeOutInMS = 10000;

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    await context.waitForNavigation({ timeout: defaultTimeOutInMS, waitUntil: 'networkidle0' });

    try {
      await context.evaluate(async function (zip) {
        const injectElementToBody = (id, value) => {
          const elem = document.createElement('div');

          elem.id = id;
          elem.innerText = value;

          document.body.appendChild(elem);
        };

        const buildDescription = () => {
          const description = document.querySelector('div[itemprop="description"]');
          let subNodes = description.querySelectorAll('*');
          let text = '';
          subNodes.forEach(subNode => {
            const listItems = subNode.querySelectorAll('li');
            if (listItems && listItems.length) {
              listItems.forEach(list => {
                text += `||${list.textContent}`;
              });
            } else if (subNode.nodeName.toLowerCase() !== 'li' && subNode.nodeName.toLowerCase() !== 'ul') {
              text += `${subNode.textContent}`;
            }
          });

          return text.trim();
        };

        injectElementToBody(`description`, buildDescription());

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
            injectElementToBody(`image-${index}`, `https:${img}`);
          }
        });

        const videos = (productInfo && productInfo.media && productInfo.media.videos) || [];
        videos.forEach((vid, index) => {
          injectElementToBody(`video-${++index}`, vid.includes('mp4') ? `https:${vid}` : `https:${vid}/mp4_480p`);
        });

        const sku = document.querySelector('span[itemprop="sku"]').getAttribute('content');
        const url = `https://www.argos.co.uk/stores/api/orchestrator/v0/cis-locator/availability?maxDistance=50&maxResults=10&skuQty=${sku}_1&channel=web_pdp&timestamp=${new Date().getTime()}&postcode=${zip}`;
        console.log(url);
        const response = await (await fetch(url, { headers: { 'Content-Type': 'application/json' } })).json();
        console.log(response);

        const availability = (response.stores && response.stores[0] && response.stores[0].messages && response.stores[0].messages[sku] && response.stores[0].messages[sku].messageKey) || '';
        injectElementToBody('availability', availability);
      }, parameters.zipcode);
    } catch (err) {
      console.log('Entering zip code for availability details failed.', err);
    }

    const manufactureData = await isSelectorAvailable('#cnet-accordion button[data-test="cnet-accordion-button-toggle"]');

    if (manufactureData) {
      try {
        await context.click('#cnet-accordion button[data-test="cnet-accordion-button-toggle"]');
        await context.waitForSelector('div[data-test="cnet-accordion-content"] .ccs-cc-block-inline', { timeout: defaultTimeOutInMS });

        await context.waitForXPath('(//div[contains(@data-test,"component-media-gallery_activeSlide")])[1]//img', { timeout: defaultTimeOutInMS });
        await context.waitForXPath('//div[@data-test="cnet-accordion-content"]//div[contains(@class,"inline-thumbnail")]/img/', { timeout: defaultTimeOutInMS });
      } catch (err) {
        console.log('Getting manufacturer data failed.');
      }
    }

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
