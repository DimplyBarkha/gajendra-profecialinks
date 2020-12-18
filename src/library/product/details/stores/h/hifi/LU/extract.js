const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    transform,
    domain: 'hifi.lu',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const prodUrl = await context.evaluate(async function () {
      return document.URL;
    });
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const descriptionDiv = document.querySelector('section[class="description"] div[class="content-wrap"]');
      if (descriptionDiv) {
        let desc = descriptionDiv.innerHTML;
        desc = desc.replace(/•/g, ' || ').replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
        addElementToDocument('desc', desc);
      }
      try {
        // @ts-ignore
        const dataObj = window.__data && window.__data.product && window.__data.product;
        if (dataObj) {
          dataObj.product && dataObj.product.averageRating && addElementToDocument('pd_rating', dataObj.product.averageRating);
          dataObj.product && dataObj.product.ean && addElementToDocument('pd_ean', dataObj.product.ean);
          dataObj.product && dataObj.product.code && addElementToDocument('pd_sku', dataObj.product.code);
          // if (dataObj.productVariants) {
          //   addElementToDocument('pd_variantCount', dataObj.productVariants[0].options.length);
          //   dataObj.productVariants[0].options.forEach(item => {
          //     addElementToDocument('pd_variants', item.product.code);
          //   });
          // }
        }
      } catch (error) {
        console.log('add element to document failed!!');
      }
    });


    try {
      await context.click('a.brand-content-link');
    } catch (err) {
      console.log('no link found');
    }

    try {
      await context.waitForSelector('#loadbeeIframeId');
    } catch (err) {
      console.log('no link found');
    }
    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('#loadbeeIframeId');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    let enhancedContent = ''; let aplusImages = ''; let videos = '';
    if (src) {
      try {
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div.wrapper.preview');
        enhancedContent = await context.evaluate(async function () {
          let enhancedContent = '';
          if (document.querySelectorAll('div.pic-text')) {
            const characterstics = document.querySelectorAll('div.pic-text');
            for (let i = 0; i < characterstics.length; i++) { enhancedContent += characterstics[i].innerText + ' || '; }
          }
          if (document.querySelectorAll('div.animation-text')) {
            const moreCharacterstics = document.querySelectorAll('div.animation-text');
            for (let i = 0; i < moreCharacterstics.length; i++) { enhancedContent += moreCharacterstics[i].innerText + ' || '; }
          }
          if (document.querySelectorAll('div.info')) {
            const attributeSections = document.querySelectorAll('div.info');
            for (let i = 0; i < attributeSections.length; i++) { enhancedContent += attributeSections[i].innerText + ' || '; }
          }
          if (document.querySelectorAll('div.info2')) {
            const moreAttributeSections = document.querySelectorAll('div.info2');
            for (let i = 0; i < moreAttributeSections.length; i++) { enhancedContent += moreAttributeSections[i].innerText + ' || '; }
          }
          return enhancedContent;
        });

        aplusImages = await context.evaluate(async function () {
          let aplusImages = '';
          if (document.querySelectorAll('img')) {
            const allImages = document.querySelectorAll('img');
            for (let i = 0; i < allImages.length; i++) {
              if (allImages[i].hasAttribute('src')) {
                aplusImages += allImages[i].getAttribute('src') + ' || ';
              }
            }
          }
          return aplusImages;
        });
        videos = await context.evaluate(async function () {
          let videos = '';
          if (document.querySelector('div[class="header-content desktop"] div[class="play-btn centered desktop"]')) {
            if (document.querySelector('div[class="header-content desktop"] div[class="play-btn centered desktop"]').hasAttribute('data-video')) { videos = document.querySelector('div[class="header-content desktop"] div[class="play-btn centered desktop"]').getAttribute('data-video'); }
          }
          return videos;
        });
      } catch (err) {}
    }

    await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function (enhancedContent, aplusImages, videos) {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('enhancedContent', enhancedContent);
      addElementToDocument('aplusImages', aplusImages);
      addElementToDocument('videos', videos);
    }, enhancedContent, aplusImages, videos);
    let video='';
    await context.evaluate(async function(video){
      let VideoSrc=document.querySelector('.autheos-videothumbnail img');
      if(VideoSrc){
      let ImgSrc= document.querySelector('.autheos-videothumbnail img').getAttribute('src');
      if(ImgSrc){
        let regex = /(.*)+(\d+p)+(.*)/g;
        video= ImgSrc.replace(regex,"$1$2");
      }
    }
      console.log('The value of video is',video);
      function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
          addHiddenDiv('video',video);
          console.log('added video div',video);
      return video;
    },video);
    // if (src) {
    //   try {
    //     await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    //     await context.waitForSelector('div.wrapper.preview');
    //     return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    //   } catch (error) {
    //     try {
    //       await context.evaluate(async function (src) {
    //         window.location.assign(src);
    //       }, src);
    //       await context.waitForSelector('div.wrapper.preview');
    //       return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // }
    // await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
  },
};
