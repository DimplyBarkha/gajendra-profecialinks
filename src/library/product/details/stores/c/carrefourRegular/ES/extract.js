
const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function infiniteScroll() {
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

      const manufacturerDesc = document.querySelector('div.product-details > div.product-details__features')
        ? document.querySelector('div.product-details > div.product-details__features').innerText : '';
      if (manufacturerDesc) addHiddenDiv('manufacturerDesc', manufacturerDesc.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
      const manufactureImage = [];
      let finalImages = [];
      const aplusImages = document.querySelector("div[id*='inpage_container'] img") ? document.querySelectorAll("div[id*='inpage_container'] img") : [];
      for (let i = 0; i < aplusImages.length; i++) {
        if (aplusImages[i].getAttribute('data-flixsrcset')) {
          manufactureImage.push(aplusImages[i].getAttribute('data-flixsrcset'));
        }
      }
      if (manufactureImage) {
        manufactureImage.forEach(item => {
          const arr = item.split(',');
          let text = arr[arr.length - 1];
          text = text.trim().split(' ') ? text.trim().split(' ')[0] : text;
          finalImages.push(text.replace(/(.*)/, 'https:$1'));
        });
      }
      // @ts-ignore
      finalImages = [...new Set(finalImages)];
      addHiddenDiv('ii_aplusImages', finalImages.join(' | '));
    });

    async function checkIframeContent() {
      return await context.evaluate(async function () {
        const manufacturerIFrameSelector = document.evaluate('//div[@class="eky-container-full"]//iframe[@id="eky-dyson-iframe"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
        if (manufacturerIFrameSrc) {
          return manufacturerIFrameSrc;
        } else {
          return false;
        }
      });
    }

    async function fetchManufacturerContentIframe(url) {
      try {
        await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      } catch (err) {
      }
      return await context.evaluate(async function () {
        const inBoxTextVideoArray = [];
        const inBoxVideoText = document.querySelectorAll('div.tns-inner > div.my-slider>div.eky-relative-wrapper.tns-normal h1');
        for (let i = 0; i < inBoxVideoText.length; i++) {
          const imgText2 = inBoxVideoText[i].innerText;
          imgText2 && inBoxTextVideoArray.push(imgText2);
        }

        const inBoxImgVideoArray = [];
        const inBoxImgVideo = document.querySelectorAll('div.tns-inner > div.my-slider>div.eky-relative-wrapper.tns-normal video');
        for (let i = 0; i < inBoxImgVideo.length; i++) {
          const imgUrl2 = "https://media.flixfacts.com/eyekandy/dyson/v11/es/" + inBoxImgVideo[i].getAttribute('src');

          imgUrl2 && inBoxImgVideoArray.push(imgUrl2);
        }

        const inBoxTextArray = [];
        const inBoxImageText = document.querySelectorAll('div.eky-accesory-title');
        for (let i = 0; i < inBoxImageText.length; i++) {
          const imgText = inBoxImageText[i].innerText;
          imgText && inBoxTextArray.push(imgText);
        }

        const inBoxImageArray = [];
        const inBoxImagesList = document.querySelectorAll('div.eky-accessory img');
        for (let i = 0; i < inBoxImagesList.length; i++) {
          const imgUrl1 = "https://media.flixfacts.com/eyekandy/dyson/v11/es/" + inBoxImagesList[i].getAttribute('src');
          imgUrl1 && inBoxImageArray.push(imgUrl1);
        }

        return { inBoxTextVideoArray, inBoxImgVideoArray, inBoxImageArray, inBoxTextArray };
      });
    }

    async function addContentToDOM(manContentObj, onlyText, inTheBoxImage) {
      await context.evaluate(async function ([manContentObj, onlyText, inTheBoxImage]) {
        function addHiddenDivForIframe(tempclass, content) {
          const newDiv = document.createElement('div');
          newDiv.className = tempclass;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        if (manContentObj) {
          for (let i = 0; i < manContentObj.inBoxImageArray.length; i++) {
            addHiddenDivForIframe('added-inBox-images', manContentObj.inBoxImageArray[i]);
          }
          for (let i = 0; i < manContentObj.inBoxTextArray.length; i++) {
            addHiddenDivForIframe('added-inBox-Text', manContentObj.inBoxTextArray[i]);
          }
          for (let i = 0; i < manContentObj.inBoxImgVideoArray.length; i++) {
            addHiddenDivForIframe('added-inBox-images-for-Video', manContentObj.inBoxImgVideoArray[i]);
          }
          for (let i = 0; i < manContentObj.inBoxTextVideoArray.length; i++) {
            addHiddenDivForIframe('added-inBox-Text-for-Video', manContentObj.inBoxTextVideoArray[i]);
          }
        }
        else {
          if (onlyText) {
            addHiddenDivForIframe('added-inBox-Text', onlyText.join('  || '));
          }
          if (inTheBoxImage) {
            // addHiddenDivForIframe('added-inBox-images', inTheBoxImage.join('  || '));
            addHiddenDivForIframe('added-inBox-images', inTheBoxImage.join('  || '));
          }
        }
      }, [manContentObj, onlyText, inTheBoxImage]);
    }

    let onlyText = await context.evaluate(async function () {
      let inBoxArray = [];
      const inBoxText = document.querySelectorAll('div.inpage_selector_InTheBox div.flix-std-desc.flix-d-h3 span');
      if (inBoxText.length > 0) {
        for (let i = 0; i < inBoxText.length; i++) {
          inBoxArray.push(inBoxText[i].innerText);
          console.log('checking >>>>>>>>> ', inBoxArray);
        }
      } else {
        const inBoxText = document.querySelectorAll('div.product-details > div.product-details__features > div.product-details__feature-container > dl.product-details__section-contents > dt.product-details__content-title');
        for (let i = 0; i < inBoxText.length; i++) {
          if (inBoxText[i].innerText === 'Accesorios') {
            inBoxArray.push(inBoxText[i].nextElementSibling.innerText);
          }
        }
      }
      return inBoxArray;
    });

    let inTheBoxImage = await context.evaluate(async function () {
      let inBoxImageArray = [];
      let imageArray5 = [];
      const inBoxImage = document.querySelectorAll('div.inpage_selector_InTheBox div.flix-background-image img');
      if (inBoxImage) {
        for (let i = 0; i < inBoxImage.length; i++) {
          imageArray5.push(inBoxImage[i].getAttribute('data-flixsrcset'));
          console.log('checking image >>>>>>>>> ', imageArray5);
        }
          if(imageArray5.length > 0){
            for(let i = 0; i < imageArray5.length; i++){
              let text = imageArray5[i];
              let splits = text.split(",");
              let splits1  = `${splits[0]}`;
              console.log("splits1",splits1);
              let splits2 = splits1.replace('200w','').trim();
              inBoxImageArray.push(splits2);
            }
          }
          console.log(' imageArray5 ',  inBoxImageArray);
        // }
      }
        return inBoxImageArray;

    });

    const iframeContentLink = await checkIframeContent();
    let manContentObj;
    if (iframeContentLink) {
      manContentObj = await fetchManufacturerContentIframe(iframeContentLink);
      try {
        await context.goto(inputs.url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      } catch (err) {
      }
    }
    await addContentToDOM(manContentObj, onlyText, inTheBoxImage);

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};