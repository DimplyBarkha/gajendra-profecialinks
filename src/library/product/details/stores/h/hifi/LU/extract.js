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
  // @ts-ignore
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

    const seeMoreProductInfoCSS = 'a.brand-content-link';
    try {
      await context.waitForSelector(seeMoreProductInfoCSS, { timeout: 10000 });
      console.log('seeMoreProductInfoCSS found, clicking it...');
      await context.click(seeMoreProductInfoCSS);
    } catch (err) {
      console.log(`no seeMoreProductInfoCSS link found : CSS => ${seeMoreProductInfoCSS}`);
    }

    try {
      await context.waitForSelector('#loadbeeIframeId');
    } catch (err) {
      console.log('no link found');
    }

    // get iframge link src
    let src = await context.evaluate(async function () {
      const iframe = document.querySelector('#loadbeeIframeId');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    let enhancedContent = '';
    let aplusImages = '';
    let videos = '';

    // getting iframe url from API
    if (!src) {
      console.log('Trying to get iframe url from API');
      try {
        const iframeDivContainerCss = '#loadbeeTabContentId';
        await context.waitForSelector(iframeDivContainerCss, { timeout: 30000 });
        console.log('iframeDivContainerCss selector found');
        await context.evaluate(async (iframeDivContainerCss) => {
          const div = document.querySelector(iframeDivContainerCss);
          const dataSet = div && div.dataset;
          console.log(`dataset: ${JSON.stringify(dataSet)}`);
          const gtin = dataSet && dataSet.loadbeeGtin;
          const apiKey = dataSet && dataSet.loadbeeApikey;
          if (!(gtin && apiKey)) return;

          const apiUrl = `https://availability.loadbee.com/v3/EAN/${gtin}/fr_BE?template=default&apiKey=${apiKey}`;
          console.log(`apiUrl: ${apiUrl}`);
          const data = await fetch(apiKey);
          console.log(`API status: ${data.status}`);
          if (data.status === 404) return;
          const jsonData = await data.json();
          console.log(`JSON from API: ${JSON.stringify(jsonData)}`);
          src = jsonData.url;
          console.log(`Iframe URL: ${src}`);
        }, iframeDivContainerCss);
      } catch (error) {
        console.log('src not found from API as well');
        console.log(error);
      }
    }
    // navigate to iframe src if available
    if (src) {
      try {
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div.wrapper.preview');
        enhancedContent = await context.evaluate(async function () {
          let enhancedContent = '';
          if (document.querySelectorAll('div.pic-text')) {
            const characterstics = document.querySelectorAll('div.pic-text');
            // @ts-ignore
            for (let i = 0; i < characterstics.length; i++) { enhancedContent += characterstics[i].innerText + ' || '; }
          }
          if (document.querySelectorAll('div.animation-text')) {
            const moreCharacterstics = document.querySelectorAll('div.animation-text');
            // @ts-ignore
            for (let i = 0; i < moreCharacterstics.length; i++) { enhancedContent += moreCharacterstics[i].innerText + ' || '; }
          }
          if (document.querySelectorAll('div.info')) {
            const attributeSections = document.querySelectorAll('div.info');
            // @ts-ignore
            for (let i = 0; i < attributeSections.length; i++) { enhancedContent += attributeSections[i].innerText + ' || '; }
          }
          if (document.querySelectorAll('div.info2')) {
            const moreAttributeSections = document.querySelectorAll('div.info2');
            // @ts-ignore
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
    } else {
      console.log('Iframe src not found, will not navigate, still at original page');
    }

    // checking if page already navigated to src/iframe url, if not no need to reload/naviagate
    if (src) await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
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

    // videos and src
    const video = '';
    await context.evaluate(async function (video) {
      const VideoSrc = document.querySelector('.autheos-videothumbnail img');
      if (VideoSrc) {
        const ImgSrc = document.querySelector('.autheos-videothumbnail img').getAttribute('src');
        if (ImgSrc) {
          const regex = /(.*)+(\d+p)+(.*)/g;
          video = ImgSrc.replace(regex, '$1$2');
        }
      }
      console.log(`The value of video is: ${video}`);

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('video', video);
      console.log('added video div', video);
      return video;
    }, video);

    // pdEan, pd_rating, sku, description
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        console.log(`${key} : ${value}`);
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // desciption
      const descriptionDivCss = 'section[class="description"] div[class="content-wrap"]';
      const descriptionDiv = document.querySelector(descriptionDivCss);
      if (descriptionDiv) {
        let desc = descriptionDiv.innerHTML;
        desc = desc.replace(/•/g, ' || ').replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
        addElementToDocument('desc', desc);
      } else console.log(`Description div not found css: ${descriptionDivCss}`);

      // pdEan, pd_rating, sku
      try {
        // @ts-ignore
        const dataObj = window.__data && window.__data.product && window.__data.product;
        if (dataObj) {
          const pdEan = dataObj.product && dataObj.product.ean;
          const pdRating = dataObj.product && dataObj.product.averageRating;
          const sku = dataObj.product && dataObj.product.code;

          pdEan ? addElementToDocument('pd_ean', pdEan) : console.log(`pd_ean: ${pdEan}`);
          pdRating ? addElementToDocument('pd_rating', pdRating) : console.log(`pd_rating: ${pdRating}`);
          sku ? addElementToDocument('pd_sku', sku) : console.log(`sku: ${sku}`);
        }
      } catch (error) {
        console.log('add element to document failed!!');
      }
    });

    await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
  },
};
