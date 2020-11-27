const { transform } = require('../format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Function to check whether manufacturer content exists
  async function checkmanufacturerContent() {
    return await context.evaluate(async function () {
      const manufacturerIFrameSelector = document.evaluate('//div[@class="product-full-description"]//iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
      if (manufacturerIFrameSrc) {
        if (!manufacturerIFrameSrc.includes('https')) {
          return `https://www.ceneo.pl/${manufacturerIFrameSrc}`;
        }
        return manufacturerIFrameSrc;
      } else {
        return false;
      }
    });
  }
  // Function to fetch manufacturer content and mnufacturer images after visiting iframe URL
  async function fetchManufacturerContentIframe(url) {
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: false });
    return await context.evaluate(async function () {

      const manufacturerDescription = document.body.innerText;
      const manufacturerVideosList = document.querySelectorAll('div.es-video__container>iframe');
      const manufacturerImagesList = document.querySelectorAll('img');
      const manufacturerVideoArray = [];
      const manufacturerImageArray = [];
      for (let i = 0; i < manufacturerVideosList.length; i++) {
        const videoUrl = manufacturerVideosList[i].getAttribute('src');
        videoUrl && manufacturerVideoArray.push(videoUrl);
      }

      for (let i = 0; i < manufacturerImagesList.length; i++) {
        let imgUrl = 'https:' + manufacturerImagesList[i].getAttribute('src');
        imgUrl && manufacturerImageArray.push(imgUrl);
      }

      return { manufacturerVideoArray, manufacturerImageArray, manufacturerDescription };
    });
  }

  // Function to add manufacturer content and description to DOM
  async function addContentToDOM(manContentObj, manufacturerContentLink) {
    await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (manufacturerContentLink) {
        // Adding manufacturer images to DOM
        for (let i = 0; i < manContentObj.manufacturerVideoArray.length; i++) {
          addHiddenDiv('my-manufacturer-videos-' + i, manContentObj.manufacturerVideoArray[i]);
        }

        for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
          addHiddenDiv('my-manufacturer-images-' + i, manContentObj.manufacturerImageArray[i]);
        }

        addHiddenDiv('my-manufacturer-description', manContentObj.manufacturerDescription);
      }
    }, [manContentObj, manufacturerContentLink]);
  }

  const manufacturerContentLink = await checkmanufacturerContent();
  let manContentObj;
  if (manufacturerContentLink) {
    manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
    await context.goto(inputs.url, { timeout: 10000, waitUntil: 'load', checkBlocked: false });
  }
  await addContentToDOM(manContentObj, manufacturerContentLink);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  await context.evaluate(async function () {
    function findLabel(productObj, label) {
      const value = productObj[label];
      if (Array.isArray(value)) {
        return {
          label: value.reduce((prevVal, currentVal) => {
            return (prevVal) ? prevVal + ',' + currentVal : currentVal;
          }, ''),
        };
      } else if (value) {
        return { label: value };
      }
      return null;
    }
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function findAndInsertLabel(obj, labelName, outputName) {
      const result = findLabel(obj, labelName);
      if (result != null) {
        addHiddenDiv(outputName, result.label);
      }
    }

    const jsonCont = document.querySelector("script[type='application/ld+json']");
    if (jsonCont) {
      try {
        const jsonString = jsonCont.innerText;
        let jsonParsed = {};
        if (jsonString && jsonString.trim()) {
          jsonParsed = JSON.parse(jsonString);
          findAndInsertLabel(jsonParsed, 'description', 'my-description');
        }
      } catch (err) { }
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    transform: transform,
    domain: 'ceneo.pl',
    zipcode: '',
  },
  implementation,
};
