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

      const imageVideoUrl = 'https://media.flixfacts.com/eyekandy/dyson/v11/au/';
      const manufacturerDescription = document.body.innerText;
      const manufacturerVideosList = document.querySelectorAll('video');
      const manufacturerImagesList = document.querySelectorAll('img[id]');
      const manufacturerVideoArray = [];
      const manufacturerImageArray = [];
      for (let i=0; i < manufacturerVideosList.length; i++) {
        const videoUrl = imageVideoUrl + manufacturerVideosList[i].getAttribute('src');
        videoUrl && manufacturerVideoArray.push(videoUrl);
      }

      for (let i=0; i < manufacturerImagesList.length; i++) {
        let imgUrl = imageVideoUrl + manufacturerImagesList[i].getAttribute('src');
        imgUrl && manufacturerImageArray.push(imgUrl);
      }

      return { manufacturerVideoArray, manufacturerImageArray, manufacturerDescription };
    });
  }

  // Function to check whether manufacturer content exists
  async function checkmanufacturerContent () {
    return await context.evaluate(async function () {
      const manufacturerIFrameSelector = document.evaluate('//div[@id="inpage_container"]//iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
        for (let i = 0; i < manContentObj.manufacturerVideoArray.length; i++) {
          addHiddenDiv('added-manufacturer-videos-' + i, manContentObj.manufacturerVideoArray[i]);
        }

        for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
          addHiddenDiv('added-manufacturer-images-' + i, manContentObj.manufacturerImageArray[i]);
        }

        addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);
      }

      // Addding normal description to DOM
      const descriptionSelector = document.querySelector('div[id="no-parallax"]');
      const description = descriptionSelector ? descriptionSelector.innerText : '';
      addHiddenDiv('added-description', description);

      const scriptDataTagSelector = document.evaluate('//*[contains(text(),"HN_PAGE_INFO")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const availability = scriptTagData ? scriptTagData.replace(/.*pack_size":"(\d+).*/gm, '$1').match(/\d+/) : '';
      addHiddenDiv('added_packSize', availability);
    }, [manContentObj, manufacturerContentLink]);
  }

  const manufacturerContentLink = await checkmanufacturerContent();
  let manContentObj;
  if (manufacturerContentLink) {
    manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
    await context.goto(inputs.url);
  }
  await addContentToDOM(manContentObj, manufacturerContentLink);

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.com.au',
    zipcode: '',
  },
  implementation,
};
