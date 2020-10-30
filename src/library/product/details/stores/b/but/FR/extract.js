const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'but',
    transform,
    domain: 'but.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {

    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    delay(10000);
    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return await Boolean(document.querySelector(currentSelector));
      }, selector);
    };

    const currentUrl = await context.evaluate(() => {
      return document.querySelector('meta[property="og:url"]').getAttribute('content')
    });

    const iframeSelector = '#eky-dyson-iframe';

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
  
      await context.evaluate(() => {
        const scrollTo = document.querySelector('#specifications');
        scrollTo.scrollIntoView({ behavior: 'smooth' });
      });
      await delay(15000);
      await context.waitForSelector('div[class="eky-row left-padding divider-line"] img');
      await delay(15000);
      const images = await context.evaluate(() => {
        const src = document.querySelectorAll('div[class="eky-row left-padding divider-line"] img');
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].currentSrc);
          }
        }
        return value;
      });
  
      const desc = await context.evaluate(() => {
        const src = document.querySelectorAll('h1,h2,h3,h4,p,div.eky-accessory>div');
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].innerText);
          }
        }
        return value;
      });
      await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await context.evaluate((video) => {
        video = video.join(' | ');
        document.querySelector('body').setAttribute('video-src', video);
      }, video);
      await context.evaluate((images) => {
        images = images.join(' | ');
        console.log(images);
        const len = images.length;
        if (images[len - 2] === '|') {
          console.log('removing | ');
          images = images.slice(0, len - 3);
        }
        document.querySelector('body').setAttribute('img-src', images);
      }, images);
      await context.evaluate((desc) => {
        desc = desc.join(' | ');
        document.querySelector('body').setAttribute('desc', desc);
      }, desc);
    }



    try {
      await context.waitForXPath('//script[contains(.,"reviewListStatistics")]');
    } catch (error) {
      console.log("SCript not loaded");
    }
    try {
      await context.waitForXPath("//div[@class='s7staticimage']//img");
    } catch (error) {
      console.log("Image not loaded");
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
       // function to get the json data from the string
    // function findJsonData (scriptSelector, startString, endString) {
       
    //     const xpath = `//script[contains(.,'${scriptSelector}')]`;
    //     let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //     // @ts-ignore
    //    let elementTxt = (element !== null) ? element.textContent : ''
    //     return elementTxt;
    // };
    // let videoContent = findJsonData ('reviewListStatistics',' var appData =','};')
    // addHiddenDiv('videos', videoContent);
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      }
      let image = document.querySelector('div.s7staticimage img');
      // @ts-ignore
      image = image ? image.src : '';
      addHiddenDiv('image', image);
      // let videoList = document.querySelectorAll("#product-swiper > ul > li.swiper-slide.simpleVideo");
      // let videoArr = [];
      // for (let index = 0; index < videoList.length; index++) {
      //   // @ts-ignore
      //   videoList[index] = videoList[index] ? videoList[index].click() : '';
      //   let close = document.querySelector('button.mfp-close');
      //   let videoUrl = document.querySelector('iframe.mfp-iframe');
      //   // @ts-ignore
      //   videoUrl = videoUrl ? videoUrl.src : '';
      //   videoArr.push(videoUrl);
      //   // @ts-ignore
      //   close = close ? close.click() : '';
      // }
      // // @ts-ignore
      // videoArr = videoArr.join(' | ');
      // addHiddenDiv('videos', videoArr);

      let description = document.querySelector('div[id="feature-product"]');
      let descriptionHTML = description ? description.innerHTML : '';
      descriptionHTML = descriptionHTML ? descriptionHTML.replace(/(.*)\<div\sid="flix-inpage"/gm,'$1').replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/\s{2,}/, ' ').replace('Les plus produit','').replace('description produit','').replace('Caractéristiques','').trim() : '';
      addHiddenDiv('descriptionHTML', descriptionHTML);
    });
    return await context.extract(productDetails, { transform });
  },
};
