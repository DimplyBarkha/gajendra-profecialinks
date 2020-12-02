const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'but',
    transform: cleanUp,
    domain: 'but.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return Boolean(document.querySelector(currentSelector));
      }, selector);
    };

    // @ts-ignore
    const currentUrl = await context.evaluate(() => {
      if (document.querySelector('meta[property="og:url"]') !== undefined && document.querySelector('meta[property="og:url"]') !== null) { return document.querySelector('meta[property="og:url"]').getAttribute('content'); }
    });

    const iframeSelector = '.flix-videodiv iframe';
    await delay(10000);
    if (await checkExistance(iframeSelector)) {
      const iframeUrl = await context.evaluate((iframeSelector) => {
        return document.querySelector(iframeSelector).getAttribute('src');
      }, iframeSelector);
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      await context.waitForXPath('//video');
      const video = await context.evaluate(() => {
        const src = ele('video');
        function ele (tag) {
          return document.querySelectorAll(tag);
        }
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].currentSrc);
          }
        }
        return value;
      });

      await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await delay(10000);
      await context.evaluate((video) => {
        video = video.join(' | ');
        document.querySelector('body').setAttribute('video-src', video);
      }, video);
    }
    await delay(5000);
    if (await checkExistance('.swiper-wrapper a[class*=video]')) {
      await context.evaluate(async (video) => {
        // @ts-ignore
        const galleryVideo = [...document.querySelectorAll('.swiper-wrapper a[class*=video]')];
        const videos = [];
        for (let i = 0; i < galleryVideo.length; i++) {
          galleryVideo[i].click();
          await new Promise((resolve) => setTimeout(resolve, 5000));
          if (document.querySelector('.mfp-iframe') !== null && document.querySelector('.mfp-iframe') !== undefined) videos.push(document.querySelector('.mfp-iframe').getAttribute('src'));
          // @ts-ignore
          if (document.querySelector('.mfp-close') !== null && document.querySelector('.mfp-close') !== undefined)document.querySelector('.mfp-close').click();
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        const galVideo = videos.join(' | ');
        document.querySelector('body').setAttribute('gallery-video', galVideo);
      });
    }

    try {
      await context.waitForXPath('//script[contains(.,"reviewListStatistics")]');
    } catch (error) {
      console.log('SCript not loaded');
    }
    try {
      await context.waitForXPath("//div[@class='s7staticimage']//img");
    } catch (error) {
      console.log('Image not loaded');
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const moreDesc = document.querySelectorAll('div[id="inpage_container"] div[class*="flix-std"]');
      if (moreDesc !== undefined && moreDesc !== null) {
        addHiddenDiv('moreDesc',
          // @ts-ignore
          [...moreDesc].map(e => e.innerText).join(''));
      }
      const isAvailable = document.querySelector('div.l-available');
      if (isAvailable !== undefined && isAvailable !== null) {
        // @ts-ignore
        addHiddenDiv('isAvailable', 'In Stock');
      } else addHiddenDiv('isAvailable', 'Out of Stock');

      const description = document.querySelector('div[id="feature-product"]');
      let descriptionHTML = description ? description.innerHTML : '';
      descriptionHTML = descriptionHTML ? descriptionHTML.replace(/(.*)<div\sid="flix-inpage"/gm, '$1').replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/\s{2,}/, ' ').replace('Les plus produit', '').replace('description produit', '').replace('Caractéristiques', '').trim() : '';
      addHiddenDiv('descriptionHTML', descriptionHTML);

      const addBulletDesc = document.querySelectorAll('div[id="feature-product"] p[class="t-paragraph"] +ul >li');
      const bullet = ' || ';
      // @ts-ignore
      if (addBulletDesc !== undefined && addBulletDesc !== null) addHiddenDiv('addBulletDesc', [...addBulletDesc].map(e => bullet.concat(e.innerText)).join());
    });

    var dataRef = await context.extract(productDetails, { transform });

    dataRef[0].group.forEach((row) => {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\|\|\s){2,}/gm, '|| ').split('La marque vous informe')[0].split('<!--')[0];
        });
        row.description = [
          {
            text: row.description[0].text.slice(0, -1),
          },
        ];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.includes('https:')) {
            // eslint-disable-next-line no-self-assign
            item.text = item.text;
          } else {
            item.text = 'https:' + item.text;
          }
        });
      }

      if (row.videos) {
        row.videos.forEach(item => {
          item.text = item.text ? item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
          if (item.text.includes('blob')) {
            item.text = item.text ? item.text.split('blob:').pop() : '';
          }
        });
      }
      if (row.shippingWeight) {
        row.shippingWeight.forEach(item => {
          item.text = item.text ? item.text.split('Pds').pop() : '';
        });
      }
    });

    return dataRef;
  },
};
