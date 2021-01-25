const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'worten',
    transform,
    domain: 'worten.es',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForSelector('.w-cookies-popup__wrapper .w-button-primary', { timeout: 10000 });
      await context.evaluate(function () {
        console.log('Clicking on button.');
        document.querySelector('.w-cookies-popup__wrapper .w-button-primary').click();
      });
    } catch (er) {
      console.log('Error while accepting cookies button.', er);
    }

    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });

    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });

    let eanXpath = '//ul//li//*[contains(@class,"details-label") and contains(.,"EAN")]//following-sibling::*[contains(@class,"details-value")]';
    let ean = await context.evaluate(async (eanXpath) => {
      let eanElm = document.evaluate(eanXpath, document, null, 7, null);
      let ean = '';
      console.log('we have the ean - ', eanElm.snapshotLength)
      if(eanElm && eanElm.snapshotLength > 0) {
        console.log('we have the ean - ', eanElm.snapshotLength)
        ean = eanElm.snapshotItem(0).textContent;
      }
      if(ean) {
        return ean.trim();
      }
      return ean;
    }, eanXpath);

    console.log('ean', ean);

    // need to check for EC iframe
    let iframeSel = 'div[id="loadbeeTabId"] > iframe';
    let ECText = '';
    let ECImagesArr = [];
    let ECVideosArr = [];
    try {
      await context.waitForSelector(iframeSel);
      console.log('got the iframe');
    } catch(err) {
      console.log('we got into some error while waiting for iframe', err.message);
      try {
        console.log('waiting again');
        await context.waitForSelector(iframeSel);
        console.log('got the iframe, finally');
      } catch(err) {
        console.log('we got into some error while waiting for iframe, again', err.message);
      }
    }

    let iframeSrc = await context.evaluate(async (iframeSel) => {
      let iframeElm = document.querySelector(iframeSel);
      let src = '';
      if(iframeElm) {
        src = iframeElm.getAttribute('src');
      }
      return src;
    }, iframeSel);
    console.log('iframeSrc', iframeSrc);

    let thisProdPageUrl = await context.evaluate(async () => {
      return (document.location.href);
    });

    console.log('thisProdPageUrl', thisProdPageUrl);

    if(iframeSrc) {
      let iframePageRes = await context.goto(iframeSrc, {timeout: 20000, waitUntil: 'load'});
      console.log('iframePageRes', iframePageRes.status);

      let panelSel = 'h4[class*="panel-title"] > a';

      await context.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        async function infiniteScroll () {
          let prevScroll = document.documentElement.scrollTop;
          while (true) {
            window.scrollBy(0, document.documentElement.clientHeight);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const currentScroll = document.documentElement.scrollTop;
            if (currentScroll === prevScroll) {
              break;
            }
            prevScroll = currentScroll;
          }
        }
        await infiniteScroll();
      });

      try {
        await context.waitForSelector(panelSel);
        console.log('we have them mostly');
      } catch(err) {
        console.log('got some error while waiting', err.message);
      }

      await context.evaluate(async (panelSel) => {
        let allElms = document.querySelectorAll(panelSel);
        for(let i = 0; i < allElms.length; i++) {
          allElms[i].click();
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }, panelSel);
      await new Promise(resolve => setTimeout(resolve, 3000));

      let ECTextSel = 'div[class*="container-fluid main-container"] > div';
      ECText = await context.evaluate(async (ECTextSel) => {
        let allElms = document.querySelectorAll(ECTextSel);
        let allText = '';
        if(allElms) {
          for(let i = 0; i < allElms.length; i++) {
            allText += allElms[i].innerText;
          }
        }
        return allText;
      }, ECTextSel);

      console.log('ec text', ECText);

      let backGroundImagesSel = 'div[class*="container-fluid main-container"] *[style*="background-image"]:not([class*=arrow_right]):not([class*=arrow_left])';
      let normalImagesSel = 'div[class*="container-fluid main-container"] img';
      
      ECImagesArr = await context.evaluate(async (normalImagesSel) => {
        let allImages = document.querySelectorAll(normalImagesSel);
        let allImagesArr = [];
        for(let i = 0; i < allImages.length; i++) {
          let thisUrl = allImages[i].getAttribute('src');
          console.log(thisUrl);
          allImagesArr.push(thisUrl);
        }
        let allUnique = new Set(allImagesArr);
        return Array.from(allUnique);
      }, normalImagesSel);

      let ECImagesArrNew = await context.evaluate(async (backGroundImagesSel) => {
        let allImages = document.querySelectorAll(backGroundImagesSel);
        let allImagesArr = [];
        let regex = /background-image:\s?url\(["|'](.+)["|']\);?\s?(.+)?/g;
        for(let i = 0; i < allImages.length; i++) {
          let thisUrl = allImages[i].getAttribute('style');
          thisUrl = thisUrl.replace(regex, '$1');
          console.log(thisUrl);
          allImagesArr.push(thisUrl);
        }
        return allImagesArr;
      }, backGroundImagesSel);

      ECImagesArr = [...ECImagesArr, ...ECImagesArrNew];

      let ECVideoSel = 'video[id*="video"]';
      let videoIsPresent = false;
      try {
        await context.waitForSelector(ECVideoSel);
        console.log('we have the video');
        videoIsPresent = true;
      } catch(err) {
        console.log('error while waiting for video - ', err.message);
      }

      if(videoIsPresent) {
        ECVideosArr = await context.evaluate(async (ECVideoSel) => {
          let allVidElms = document.querySelectorAll(ECVideoSel);
          let allvideoArr = [];
          for(let i = 0; i < allVidElms.length; i++) {
            let thisVideoUrl = allVidElms[i].getAttribute('src');
            console.log('thisVideoUrl', thisVideoUrl);
            allvideoArr.push(thisVideoUrl);
          }
          return allvideoArr;
        }, ECVideoSel);
      }

      console.log(ECVideosArr.length, ECImagesArr.length);
      

      const URL = thisProdPageUrl;
      await context.goto(URL, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: false });
      await new Promise(resolve => setTimeout(resolve, 7000));
      
    }

    console.log(ECImagesArr.join(' || '));

    try {
      await context.waitForSelector('.w-cookies-popup__wrapper .w-button-primary', { timeout: 10000 });
      await context.evaluate(function () {
        console.log('Clicking on button.');
        document.querySelector('.w-cookies-popup__wrapper .w-button-primary').click();
      });
    } catch (er) {
      console.log('Error while accepting cookies button.', er);
    }

    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });

    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });

    async function scrollToRec (node) {
      await context.evaluate(async (node) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, node);
    }
    await scrollToRec('footer#main-footer');
    await scrollToRec('div.w-section__wrapper');
    await scrollToRec('div.w-cards-block.w-section__block.w-section-content__box');

    await context.evaluate(function () {
      console.log('Scrolling to the bottom of page.');
      if (document.querySelector('.footer__bar')) {
        document.querySelector('.footer__bar').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    });

    try {
      await context.waitForSelector('#flixmediaInsert', { timeout: 60000 });
    } catch (err) {
      console.log('Enhanced content did not load');
    }

    try {
      await context.waitForSelector('div[class*="flix-videodiv"] iframe', { timeout: 60000 });
    } catch (err) {
      console.log('Enhanced content video did not load');
    }
    await context.evaluate(function () {
      // document.body.setAttribute("ii_url", window.location.href);

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      addHiddenDiv('ii_CTR', !!document.querySelector('div#flix-comp'));
    });
    
    await context.evaluate(async (ECText, ECImagesArrText, ECVideosArrText) => {
      console.log(ECText, ECImagesArrText, ECVideosArrText);
      async function addElementToDocumentAsync (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild(catElement);
      }
      await addElementToDocumentAsync('ectext', ECText);
      await addElementToDocumentAsync('ecimages', ECImagesArrText);
      await addElementToDocumentAsync('ecvideos', ECVideosArrText);
    },
    ECText,
    ECImagesArr.join(' || '),
    ECVideosArr.join(' || '));
    await context.extract(productDetails, { transform });
  },
};
