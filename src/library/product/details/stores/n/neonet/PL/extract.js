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
  async function checkVideo () {
    return await context.evaluate(async function () {
      const videoSelector = document.evaluate('//iframe[@title="movie"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const videoSrc = videoSelector ? videoSelector.src : '';
      if (videoSrc) {
        return videoSrc;
      } else {
        return false;
      }
    });
  }

  const videoLink = await checkVideo();
  // console.log('videoLink ....', videoLink);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log('Correct till here...............videoLink --', videoLink);
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
  // Function to fetch manufacturer content and mnufacturer images after visiting iframe URL
  async function fetchManufacturerContentIframe (url) {
    try {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    } catch (err) {
    }
    return await context.evaluate(async function () {
      const manufacturerDescription = document.body.innerText;
      const manufacturerImagesList = document.querySelectorAll('img');
      const manufacturerImageArray = [];

      for (let i = 1; i < manufacturerImagesList.length; i++) {
        const imgUrl = manufacturerImagesList[i].getAttribute('src');
        imgUrl && manufacturerImageArray.push(imgUrl);
      }
      return { manufacturerImageArray, manufacturerDescription };
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
      if (manufacturerContentLink) {
        const imageUrlSfx = manufacturerContentLink.replace('index.html', '');
        // Adding manufacturer images to DOM
        for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
          addHiddenDiv('added-manufacturer-images-' + i, imageUrlSfx + manContentObj.manufacturerImageArray[i]);
        }
        addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);
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
