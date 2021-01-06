const { transform } = require('../../bestbuy/format');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const mainUrl = await context.evaluate(async function () {
    return window.location.href;
  });

  const iFrameSrc = await context.evaluate(async function () {
    const manuf = document.querySelector('button[data-track*="From the Manufacturer');
    if (manuf) {
      manuf.click();
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    const iFrameSrc = document.querySelector('iframe.manufacturer-content-iframe') && document.querySelector('iframe.manufacturer-content-iframe').getAttribute('src');
    return iFrameSrc;
  });
  let manufacturerData = '';
  if (iFrameSrc) {
    const timeout = parameters.timeout ? parameters.timeout : 130000;
    await context.goto(iFrameSrc);
    await context.waitForSelector('div#syndi_powerpage div[class*="syndigo-shadowed-powerpage"]');
    manufacturerData = await context.evaluate(async function () {
      const manuData = document.querySelector('div#syndi_powerpage div[class*="syndigo-shadowed-powerpage"]');
      const getShadowDomHtml = (manuData) => {
        let shadowText = '';
        const shadowImage = [];
        if (manuData && manuData.shadowRoot) {
          let imagesHtml = manuData.shadowRoot.childNodes[0];
          for (const el of manuData.shadowRoot.childNodes) {
            shadowText += el.innerText;
          }
          imagesHtml = imagesHtml.querySelectorAll('img') || '';
          if (imagesHtml && imagesHtml.length) {
            imagesHtml.forEach(element => {
              shadowImage.push(element.src);
            });
          }
        }
        return { shadowText: shadowText.trim(), shadowImage };
      };
      return getShadowDomHtml(manuData);
    });
    await context.goto(mainUrl, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
  }
  try {
    // await context.captureRequests();
    // try{
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    // await context.waitForSelector('button[data-track*="From the Manufacturer"]')
    // await context.click('button[data-track*="From the Manufacturer"]')
    // await context.waitForSelector('iframe.manufacturer-content-iframe')
    // const ifr = document.querySelector('iframe.manufacturer-content-iframe')
    // if(ifr){
    //   const aplusImg = ifr.contentDocument.body.querySelectorAll('img.wc-media');

    // }

    // } catch (error){
    //   console.log('Manufacturer contents are not loaded')
    // }
    // try {
    //   await context.click('li.video-thumbnail')
    //   await context.waitForSelector('div.video-thumbnail-wrapper')
    // } catch (error) {
    //   console.log('there are no videos');
    // }
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        await new Promise(resolve => setTimeout(resolve, 8000));
        // await context.waitForSelector('button[data-track*="From the Manufacturer"]')
        // await context.click('button[data-track*="From the Manufacturer"]')
        const manuf = document.querySelector('button[data-track*="From the Manufacturer');
        if (manuf) {
          manuf.click();
          await new Promise(resolve => setTimeout(resolve, 5000));
          // await context.waitForSelector('iframe.manufacturer-content-iframe');
          const ifr = document.querySelector('iframe.manufacturer-content-iframe');
          if (ifr) {
            const aplusImgs = ifr.contentDocument.body.querySelectorAll('img.wc-media');
            console.log('aplusImgs', aplusImgs);
            if (aplusImgs && aplusImgs.length > 0) {
              aplusImgs.forEach((el, idx) => {
                const img = el.getAttribute('src');
                if (img) {
                  addHiddenDiv(`aplusImg_${idx}`, img);
                }
              });
            }
          }
        }
      } catch (error) {
        console.log('Manufacturer contents are not loaded');
      }
      const vidSel = document.querySelector('li.video-thumbnail button');
      if (vidSel) {
        vidSel.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      const videos = [];
      const videoElem = document.querySelectorAll('div.video-thumbnail-wrapper li button');
      // console.log("videoElems:::::::::", videoElem);
      if (videoElem && videoElem.length > 0) {
        for (let i = 0; i < videoElem.length; i++) {
          videoElem[i].click();
          await new Promise(resolve => setTimeout(resolve, 1000));

          const videoUrl = document.querySelector('video source').getAttribute('src');
          // console.log("videoUrl:: ", videoUrl);
          videos.push(videoUrl);
          addHiddenDiv(`ii_video_${i}`, videoUrl);
        }
      }
      // image
      const imgSel = document.querySelector('button#product-images-tab');
      // console.log("imgSel:::: ", imgSel);
      if (imgSel) {
        imgSel.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      const imgEle = document.querySelectorAll('li.thumbnail-content button');
      // console.log("imgEle:: ", imgEle);
      if (!imgEle) {
        document.querySelector('li.image-more-thumbnail button').click();
      }

      // if (imgEle && imgEle.length > 0) {
      //   for (let i = 0; i < imgEle.length; i++ ) {

      //     imgEle[i].click()
      //     await new Promise(resolve => setTimeout(resolve, 1000));

      //     const imgUrl = document.querySelector('img.primary-image.zoomable.high-resolution.loaded').getAttribute('src');
      //     console.log("imgUrl:: ", imgUrl);
      //     addHiddenDiv(`thumbnail_${i}`, imgUrl);
      //     }
      // }
      // return videos;
    });

    const videos = [];
    // const request = await context.searchAllRequests('videos') || [];
    // console.log('video request:: ', request);
    //  videos = new Set(request.map(({url})=>url));
    //  await new Promise(resolve => setTimeout(resolve, 2000));

    await context.evaluate(async function (videos) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // for (const [index, video] of videos.entries()) {
      //   addHiddenDiv(`ii_video_${index}`, video)
      // }
      // try {
      //   document.querySelector('li.image-more-thumbnail button').click()
      // } catch (error) {
      //   console.log('No extra Image',error);
      // }
      const descContent = (document.querySelector('div.overview-accordion-content-wrapper')) ? document.querySelector('div.overview-accordion-content-wrapper').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      descContent && addHiddenDiv('ii_description', descContent);
      const iframe = document.querySelector('iframe.manufacturer-content-iframe');
      if (iframe) {
        iframe.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
          const container = document.querySelector('div.shop-manufacturer-content');
          const manufaturerContents = iframe.contentDocument.documentElement.innerHTML.replace(/<div\s*class="wc-json-data".*?<\/div>/g, ' ');
          if (/360-view/i.test(manufaturerContents)) {
            addHiddenDiv('roundimg', 'Yes');
          }
          container.innerHTML = manufaturerContents;
        } catch (error) {
          console.log(error);
        }
      }
    }, Array.from(videos));

    await context.evaluate(async function () {
      document.querySelector('button.has-text.image-button') ? document.querySelector('button.has-text.image-button').click() : document.querySelector('button.see-more-images-button') ? document.querySelector('button.see-more-images-button').click() : '';
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const secondaryImages = document.querySelectorAll('li.thumbnail-content img');
      const secondaryImagesArr = [];
      if (secondaryImages) {
        for (let i = 1; i < secondaryImages.length; i++) {
          secondaryImagesArr.push(secondaryImages[i].src);
          addHiddenDiv('secImages', secondaryImagesArr[i]);
        }
      }
    });
    // await context.extract(productDetails, { transform });
  } catch (error) {
    console.log(error);
  }
  await context.evaluate(async function (manufacturerData) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    console.log('---------->', manufacturerData);
    manufacturerData.shadowText && addHiddenDiv('pd_manu_desc', manufacturerData.shadowText);
    manufacturerData.shadowImage && manufacturerData.shadowImage.length && manufacturerData.shadowImage.forEach(element => {
      addHiddenDiv('aplus_img', element);
    });
  }, manufacturerData);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation,
};
