const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('div[class="gallery-thumbnail"] div[class*="gallery-thumbnail-item thumbnail-video"] button');
    await context.click('div[class="gallery-thumbnail"] div[class*="gallery-thumbnail-item thumbnail-video"] button');
  } catch (error) {
    try {
      await context.evaluate(async function () {
        const videoButton = document.querySelector('div[class="gallery-thumbnail"] div[class*="gallery-thumbnail-item thumbnail-video"] button');
        // @ts-ignore
        videoButton && videoButton.click();
      });
    } catch (error) {
      console.log('Failed to click video attempt 2');
    }
    console.log('Failed to click video');
  }
  try {
    await context.evaluate(async function () {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const video = document.querySelector('iframe[aria-label*="Video"]');
      // @ts-ignore
      video && video.src && addElementToDocument('pd_video', video.src);
      console.log('video src---->', video);
    });
  } catch (error) {
    console.log('video fetch failed!!');
  }

  try {
    await context.click('div[class="gallery-thumbnail"] div[class*="gallery-thumbnail-item"]:first-child button');
  } catch (error) {
    console.log('Failed to click first image');
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'crateandbarrel',
    transform,
    domain: 'crateandbarrel.com',
    zipcode: '',
  },
  implementation,
};
