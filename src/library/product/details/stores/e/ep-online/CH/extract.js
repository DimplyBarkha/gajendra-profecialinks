const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // If cookie pop up appears then clicking on accept button
  await context.evaluate(async function () {
    const cookieButtonSelector = document.querySelector('button[class*="accept-all-btn"]');
    cookieButtonSelector && cookieButtonSelector.click();
  });

  // Function to fetch manufacturer content and mnufacturer images after visiting iframe URL
  async function fetchManufacturerContentIframe (url) {
    await context.goto(url);
    return await context.evaluate(async function () {
      function getListOfImagesByXPath (xpath) {
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        return result;
      }

      const manufacturerDescription = document.body.innerText;
      const manufacturerImageArray = [];
      const manufacturerImagesList = getListOfImagesByXPath('//div[contains(@class, "img")] | //p[contains(@class, "img")]');
      let imgNode = manufacturerImagesList.iterateNext();
      while (imgNode) {
        const imgUrlRegex = /.*url.*(http.*?)"?\).*/gm;
        if (imgNode.getAttribute('style') && imgUrlRegex.test(imgNode.getAttribute('style'))) {
          const imgUrl = imgNode.getAttribute('style').replace(imgUrlRegex, '$1');
          imgUrl && manufacturerImageArray.push(imgUrl);
        }
        imgNode = manufacturerImagesList.iterateNext();
      }
      return { manufacturerImageArray, manufacturerDescription };
    });
  }

  // Function to check whether manufacturer content exists
  async function checkmanufacturerContent () {
    return await context.evaluate(async function () {
      const manufacturerIFrameSelector = document.evaluate('//div[@id="details-tab"]//iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
      if (manufacturerIFrameSrc) {
        return manufacturerIFrameSrc;
      } else {
        return false;
      }
    });
  }

  // Function to add manufacturer content and description to DOM
  async function addContentToDOM (manContentObj, manufacturerContentLink) {
    await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (manufacturerContentLink) {
        // Adding manufacturer images to DOM
        for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
          addHiddenDiv('added-manufacturer-images-' + i, manContentObj.manufacturerImageArray[i]);
        }
        addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);
      }

      // Addding normal description to DOM
      const descriptionSelector = document.querySelector('div[id="details-tab"]');
      const description = descriptionSelector ? descriptionSelector.innerText : '';
      addHiddenDiv('added-description', description);
    }, [manContentObj, manufacturerContentLink]);
  }

  const manufacturerContentLink = await checkmanufacturerContent();
  let manContentObj;
  if (manufacturerContentLink) {
    manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
    await context.goto(inputs.url);
  }
  await addContentToDOM(manContentObj, manufacturerContentLink);

  await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const productCarousel = [...document.querySelectorAll('div.carousel-item')];
      const uipdpArr = [];
      productCarousel.forEach((element) => {
        const brand = element.querySelector('.carousel-brand') ? element.querySelector('.carousel-brand').innerText : '';
        const productName = element.querySelector('.carousel-name') ? element.querySelector('.carousel-name').innerText : '';
        uipdpArr.push(brand + ' ' + productName);
      });
      addHiddenDiv('ii_uipdp', uipdpArr.length ? uipdpArr.join(' || ') : '');
  
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'ep-online',
    transform,
    domain: 'ep-online.ch',
    zipcode: '',
  },
  implementation,
};
