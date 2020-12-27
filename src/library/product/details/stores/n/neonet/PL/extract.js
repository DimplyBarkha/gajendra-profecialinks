const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const cssBtn = 'button.productDetailGallery-finiteNavigator-3iH:last-child';

  const isSelectorAvailable = async (cssSelector) => {
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };



  for (let cnt = 0; cnt < 30; cnt++) {
    try {
      await context.waitForSelector(cssBtn, { timeout: 2000 });
      const productAvailable = await isSelectorAvailable(cssBtn);
      if (productAvailable) {
        console.log('clicking product link');
        await context.click(cssBtn);
        await context.waitForNavigation({ timeout: 5000, waitUntil: 'load' });
      } else {
        console.log('else block ## clicking product link');
        break;
      }
    } catch (err) { }
  }
  await new Promise((resolve) => setTimeout(resolve, 10000));
  // Function to check whether video content exists
  let productUrl = '';
  async function checkVideo (productUrl) {
    return await context.evaluate(async function (productUrl) {
      productUrl = window.location.href;
      async function timeout(ms) {
        console.log('waiting for ' + ms + ' millisecs');
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      let videoThumbnail = document.querySelectorAll('button[class*="commonCss-thumb-Dw9"] button[class*="playIcon"]');
      if(videoThumbnail.length > 0) {
        videoThumbnail[0].parentElement.parentElement.parentElement.click();
        await timeout(50000);
      } else {
        console.log('we do not have any thumbnail for video');
      }

      const videoSelector = document.evaluate('//iframe[@title="movie"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      let videoSrc = '';
      if(videoSelector && videoSelector.hasAttribute('src')) {
        videoSrc = videoSelector.src;
      } else {
        console.log('iframe has no src');
      }

      console.log(videoSrc + ' is the video link that we need to check');
      if (videoSrc) {
        // let videoSrc = "https://www.youtube.com/embed/dqbmkF7rn0k?rel=0&enablejsapi=1&version=3&playerapiid=ytplayer";
        const regex = /embed\/(.+)\?/g;
        let codeElm = [];
        let code = ""
        if(videoSrc.includes("youtube")) {
          console.log('video link is - ' + videoSrc);
          codeElm = [...videoSrc.matchAll(regex)];
          code = codeElm[0][1];
          let gotoVideoUrl = '';
          if(code) {
            gotoVideoUrl = `https://www.youtube.com/watch?v=${code}`;
            console.log('video url to go to is - ' + gotoVideoUrl);
          } else {
            console.log('we do not have the code to go to url');
          }
          return gotoVideoUrl;
        } else {
        console.log("This is not a youtube video - not sure if it is playable or not");
        }

        return videoSrc;
      } else {
        console.log('we do not have the video link in the iframe');
        return false;
      }
    }, productUrl);
  }

  async function checkVideoPlayable (videoLink) {
    await context.goto(videoLink, {
      firstRequestTimeout: 60000,
      timeout: 40000,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    try {
       await context.waitForSelector('div[class*="g-recaptcha"]');
       // @ts-ignore
       await context.evaluateInFrame('iframe', () => grecaptcha.execute());
       await context.waitForNavigation();
    } catch (err) {
      console.log('either captcha not found or not solved', err.message);
    }

    return await context.evaluate(async function () {
      let videoPlayable = true;
      let b = document.evaluate('//script[contains(.,"ytInitialData")]', document, null, 7, null);
      if(b.snapshotLength > 0 && b.snapshotItem(0).textContent) {
        videoPlayable = !(b.snapshotItem(0).textContent.trim().includes("Video unavailable"));
      }

      console.log('is video playable - ' + videoPlayable);
      return videoPlayable;
    });
  }



  let videoLink = await checkVideo(productUrl);
  // console.log('videoLink ....', videoLink);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log('product url is - ' + inputs.url);
  console.log('Correct till here...............videoLink --', videoLink);
  let videoPlayable = true;
  if(videoLink && videoLink.includes("youtube")) {
    videoPlayable = await checkVideoPlayable(videoLink);
  }
  if(!videoPlayable) {
    videoLink = '';
  }

  await context.goto(inputs.url);
  await context.waitForNavigation();
  // Function to check whether manufacturer content exists
  async function checkmanufacturerContent () {
    return await context.evaluate(async function () {
      const manufacturerIFrameSelector = document.evaluate('//div[@id="rich-content-ext"]/iframe[@class="iFrame-iframe-2gX"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
      if (manufacturerIFrameSrc) {
        return manufacturerIFrameSrc;
      } else {
        return false;
      }
    });
  }
  //extracting manufacturer content and mnufacturer images which is not in iframe
  await context.evaluate(()=>{
    if(document.querySelector('button[class*=productRichContent]')) {
      document.querySelector('button[class*=productRichContent]').click();
      document.querySelector('button[class*=productRichContent]').scrollIntoView({behavior: 'smooth'});
      document.querySelector('nav[class*="sectionsNavigation"]').scrollIntoView({behavior: 'smooth'});
      document.querySelector('button[class*=productRichContent]').scrollIntoView({behavior: 'smooth'});
    }
  });
  try{
    await context.waitForSelector('div[id="productRichContent"] img');
  } catch(e){
    console.log('Either manufacturer image not present or it is under iframe', e.message);
  }
  // Function to fetch manufacturer content and mnufacturer images after visiting iframe URL
  async function fetchManufacturerContentIframe (url) {
    try {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    } catch (err) {
    }
    return await context.evaluate(async function () {

      const hasComparisionTable = document.querySelector('div.table-responsve');

      const inBoxTextArray = [];
      const inBoxImageText = document.querySelectorAll('div.description-row > div.description-col-md-3');
      for (let i = 0; i < inBoxImageText.length; i++) {
        const imgText = inBoxImageText[i].innerText;
        imgText && inBoxTextArray.push(imgText);
      }
      console.log("inBoxTextArray >>>>>>", JSON.stringify(inBoxTextArray));

      const manufacturerDescription = document.body.innerText;
      const manufacturerImagesList = document.querySelectorAll('img');
      const manufacturerImageArray = [];
      const inBoxImageArray = [];
      const inBoxImagesList =  document.querySelectorAll('div.description-row > div.description-col-md-3 img')

      for (let i = 0; i < inBoxImagesList.length; i++) {
        const imgUrl1 = inBoxImagesList[i].getAttribute('src');
        imgUrl1 && inBoxImageArray.push(imgUrl1);
      }
      console.log("inBoxImageArray >>>>>>", JSON.stringify(inBoxImageArray));

      for (let i = 1; i < manufacturerImagesList.length; i++) {
        const imgUrl = manufacturerImagesList[i].getAttribute('src');
        imgUrl && manufacturerImageArray.push(imgUrl);
      }
      return { manufacturerImageArray, manufacturerDescription, inBoxImageArray , inBoxTextArray , hasComparisionTable };
    });
  }
  // Function to add manufacturer content and description to DOM
  async function addContentToDOM (manContentObj, manufacturerContentLink, videoLink) {
    await context.evaluate(async function ([manContentObj, manufacturerContentLink, videoLink]) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // addHiddenDiv('hasComparisonTable11', manContentObj.hasComparisonTable1 );
      if (manufacturerContentLink) {
        const imageUrlSfx = manufacturerContentLink.replace('index.html', '');
        // Adding manufacturer images to DOM
        for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
          addHiddenDiv('added-manufacturer-images-' + i, imageUrlSfx + manContentObj.manufacturerImageArray[i]);
        }
        addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);

        for (let i = 0; i < manContentObj.inBoxImageArray.length; i++) {
          addHiddenDiv('added-inBox-images-' + i, imageUrlSfx + manContentObj.inBoxImageArray[i]);
        }

        for (let i = 0; i < manContentObj.inBoxTextArray.length; i++) {
          addHiddenDiv('added-inBox-Text-',manContentObj.inBoxTextArray[i]);
        }

        if(manContentObj.hasComparisionTable){
          addHiddenDiv('checkhasComparisionTable', manContentObj.hasComparisionTable);
        }

      }
      if (videoLink) {
        addHiddenDiv('added-video', videoLink);
      }
    }, [manContentObj, manufacturerContentLink, videoLink]);
  }

  const manufacturerContentLink = await checkmanufacturerContent();
  let manContentObj;
  if (manufacturerContentLink) {
    manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
    try {
      await context.goto(inputs.url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    } catch (err) {
    }
  }

  await addContentToDOM(manContentObj, manufacturerContentLink, videoLink);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    transform: transform,
    domain: 'neonet.pl',
    zipcode: '',
  },
  implementation: implementation,
};
