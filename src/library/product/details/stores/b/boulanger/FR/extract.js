const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Fetching brand from JSON and if not available then first word from the product name
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to load alternate images on the DOM by clicking on the slider button
    const slideAndLoadAlternateImages = async function () {
      async function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      const fireMouseOverEvent = function (sliderButtonSelector) {
        const mouseOverEvent = new Event('mouseover');
        sliderButtonSelector.dispatchEvent(mouseOverEvent);
      };

      const fireMouseDownEvent = function (sliderButtonSelector) {
        const mouseDownEvent = new Event('mousedown');
        sliderButtonSelector.dispatchEvent(mouseDownEvent);
      };

      const fireMouseUpEvent = function (sliderButtonSelector) {
        const mouseUpEvent = new Event('mouseup');
        sliderButtonSelector.dispatchEvent(mouseUpEvent);
      };

      // Clicking on slider button to load all alternateImages
      const sliderButtonSelector = document.querySelector('div[id*="rightButton"]');
      let sliderButtonState = sliderButtonSelector ? sliderButtonSelector.getAttribute('state') : '';
      while (sliderButtonState && sliderButtonState !== 'disabled') {
        fireMouseOverEvent(sliderButtonSelector);
        fireMouseDownEvent(sliderButtonSelector);
        fireMouseUpEvent(sliderButtonSelector);
        await timeout(2000);
        sliderButtonState = sliderButtonSelector.getAttribute('state');
      }
    };
    await slideAndLoadAlternateImages();

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.evaluate('//div[@id="presentation"]//div[@itemprop="description"]//img/@src | //div[@id="presentation"]//div[@itemprop="description"]//video/@src', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const descriptionSelector = document.querySelector('div[id="presentation"] div[itemprop="description"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
  });
  await new Promise(resolve => setTimeout(resolve, 20000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    transform,
    domain: 'boulanger.com',
    zipcode: '',
  },
  implementation,
};
