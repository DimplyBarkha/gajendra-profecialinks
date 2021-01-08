
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
          const fixedText = `||${text}||`;
          element.innerText = fixedText;
        });
      }
    });
    await context.extract(productDetails, { transform });
  },
};
