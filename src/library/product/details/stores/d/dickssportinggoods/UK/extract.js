const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('div.image-viewer-container div.mx-auto  button', { timeout: 7000 });
  } catch (e) {
    console.log('more images not found');
  }

  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    try {
      const moreImages = document.querySelector('div.image-viewer-container div.mx-auto  button');
      if (moreImages) {
        moreImages.click();
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      const shownImagesList = document.querySelectorAll('.lg-thumb-item img');
      if (shownImagesList.length > 0) {
        for (let i = 0; i < shownImagesList.length; i++) {
          const imgUrl1 = shownImagesList[i].getAttribute('src');
          addElementToDocument('customImages', imgUrl1);
        }
        document.querySelector('span.lg-close').click();
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      }
    } catch (e) {
      console.log('error in view all images');
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'dickssportinggoods',
    transform: transform,
    domain: 'dickssportinggoods.com',
    zipcode: "''",
  },
  implementation,
};
