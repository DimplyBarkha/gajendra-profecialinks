const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: transform,
    domain: 'expert.ie',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    await context.evaluate(async function () {
      var elmnt = document.querySelector('div.page-wrapper, div.footer-main');
      elmnt.scrollIntoView();
    });

    const loadVideo = await context.evaluate(async function () {
      return !!document.querySelector('div.flix_mod_video');
    });

    try {
      await context.waitForSelector('div.fotorama-item', { timeout: 85000 });
    } catch (error) {
      console.log('No secondary images loading.');
    }

    if (loadVideo) {
      try {
        await context.waitForSelector('iframe[title*="Flix-media-video"]', { timeout: 75000 });
      } catch (error) {
        console.log('No videos loading.');
      }
    }
    try {
      await context.waitForSelector('div[class*="fotorama__nav__shaft"]', { timeout: 85000 });
    } catch (error) {
      console.log('Alternate images not loading');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      await stall(4500);
      Array.from(document.querySelectorAll('#product_description div.value > ul > li')).forEach(elm => { elm.textContent = '|| ' + elm.textContent; });
      let bigImageSrc = null; let picId = null;
      if (document.querySelector('div[class*="fotorama__stage__frame"]')) {
        const bigImage = document.querySelector('div[class*="fotorama__stage__frame"] img');
        bigImageSrc = bigImage.getAttribute('src');
        picId = bigImageSrc.replace(/(.+)(\/cache\/)(\w+)(\/)(.+)/g, '$3');
      } else { console.log('frame not present'); }
      if (document.querySelectorAll('div[class*="fotorama__thumb"] img')) {
        const photoThumbs = document.querySelectorAll('div[class*="fotorama__thumb"] img');
        for (let i = 1; i < photoThumbs.length; i++) {
          let miniPic = photoThumbs[i].getAttribute('src');
          const miniPicId = miniPic.replace(/(.+)(\/cache\/)(\w+)(\/)(.+)/g, '$3');
          miniPic = miniPic.replace(miniPicId, picId);
          addElementToDocument('alternateImages', miniPic);
        }
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
