
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    transform: cleanUp,
    domain: 'boulanger.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForSelector('div.modal-content', { timeout: 25000 });
    } catch (error) {
      console.log('Modal not loading');
    }
    try {
      await context.click('body');
      await context.evaluate(function () {
        if (document.querySelector('body')) {
          document.querySelector('body').click();
        }
      });
    } catch (error) {
      console.log('Attempting to click outside of modal');
    }

    async function scrollToRec (node) {
      await context.evaluate(async (node) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 3500);
          });
        }
      }, node);
    }
    await scrollToRec('div#footer');
    const popUpAccept = await context.evaluate(function () {
      return document.querySelector('div#privacy-cat-modal');
    });
    try {
      await context.waitForSelector('div#privacy-cat-modal', { timeout: 10000 });
      if (popUpAccept) {
        await context.click('button#btnAll-on');
        await context.evaluate(function () {
          if (document.querySelector('button#btnAll-on')) {
            document.querySelector('button#btnAll-on').click();
          }
        });
      }
    } catch (e) {
      console.log('No pop-up');
    }
    const buttonExists = await context.evaluate(async function () {
      return document.querySelector('button#btnAll-on');
    });
    if (buttonExists) {
      await context.click('button#btnAll-on');
    }
    await scrollToRec('div#footer');
    await scrollToRec('div#footer');
    await scrollToRec('div#BVRRDisplayContentID');
    await context.evaluate(async function () {
      // Get brand link
      const brandSelector = document.querySelector("span[itemprop='brand']");
      if (brandSelector) {
        const linkBrand = brandSelector.closest('a').getAttribute('href');
        if (linkBrand) {
          document.body.setAttribute('brandhref', `https://www.boulanger.com${linkBrand}`);
        }
      }
      // Create gtin13 if there is not span containing it
      const gtin = document.querySelector('span[itemprop=gtin13]');
      if (!gtin) {
        const imageGtin = document.querySelector('meta[property="og:image"]');
        if (imageGtin) {
          const regex = /\/(\d+)/;
          // @ts-ignore
          const matched = imageGtin.content.match(regex);
          if (matched[1]) {
            const span = document.createElement('span');
            span.setAttribute('itemprop', 'gtin13');
            span.innerHTML = matched[1];
            document.body.appendChild(span);
          }
        }
      }
      // Click video selector to load video itself
      const videoClick = document.querySelector('td#H5V_Video');
      if (videoClick) {
        // @ts-ignore
        videoClick.click();
        const moreVideos = document.querySelectorAll('div.video_grid_thumb_cell');
        if (moreVideos) {
          moreVideos.forEach(element => {
            const regex = /^Boulanger/;
            const urlSelector = element.querySelector('div').dataset.videoAssetName;
            const match = urlSelector.match(regex);
            if (match) {
              element.querySelector('div').setAttribute('data-video-asset-name', `https://boulanger.scene7.com/is/content/${urlSelector}`);
            }
          });
        }
      }

      // Create videos duration
      const videosSelector = document.querySelectorAll('video.s7Video, video#jp_video_0');
      videosSelector.forEach(element => {
        // @ts-ignore
        const videoLenght = element.duration;
        element.setAttribute('duration', videoLenght);
      });
      // Create PDF information
      const pdfSelector = document.querySelector('li.notice-pdf-a');
      if (pdfSelector) {
        pdfSelector.setAttribute('pdfpresent', 'Yes');
      }
      // "Click" next images button to load url of images
      let nextImagesSelector = document.querySelector('div.s7button.s7scrollrightbutton');
      if (nextImagesSelector) {
        do {
          nextImagesSelector.dispatchEvent(new Event('mouseup'));
          await new Promise((resolve) => setTimeout(resolve, 1000));
          nextImagesSelector = document.querySelector('div.s7button.s7scrollrightbutton');
        } while (nextImagesSelector.getAttribute('state') !== 'disabled');
      }
      // Is "button for specification" then click
      const specificationButton = document.querySelector('p.endtable-btn.activated > button');
      if (specificationButton) {
        // @ts-ignore
        specificationButton.click();
      }
      // add double pipes to additionalDescBulletInfo
      const additionalDescBulletInfoSelector = document.querySelector('ul.bestpoints-list');
      if (additionalDescBulletInfoSelector) {
        const bullets = additionalDescBulletInfoSelector.querySelectorAll('li');
        bullets.forEach(element => {
          const text = element.innerText;
          const fixedText = `${text}||`;
          element.innerText = fixedText;
        });
      }
      // Create availability
      const availabilitySelector = document.querySelector('link[itemprop="availability"]');
      if (availabilitySelector) {
        const instockReg = /instock/i;
        const outofstockReg = /outofstock/i;
        const availabilityUrl = availabilitySelector.href;
        if (availabilityUrl.match(outofstockReg)) {
          document.body.setAttribute('availability', 'Out of Stock');
        }
        if (availabilityUrl.match(instockReg)) {
          document.body.setAttribute('availability', 'In Stock');
        }
      }
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      await sleep(3000);

      const compparisionTable = document.evaluate(`//div[@id='presentation']/div/p/img[contains(@alt, 'comparateur')]/@src`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
      document.body.setAttribute('import-comparision', compparisionTable ? 'Yes' : 'No')
    });
    await context.extract(productDetails, { transform });
  },
};
