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

  await context.evaluate(async function (url) {
    // Website opens up listings page in case of some product URLs...Hence throwing error manually if listings page opens up
    const productPageFlag = document.querySelector('div[class="blocListe"]');
    if (productPageFlag) {
      throw new Error('Details page cannot be loaded....Listings page appeared for the following URL...' + url);
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    /**
     * Function to fetch variants and count and add to DOM
     * The id for the selected variant is not present in the variant block hence
     * fetching it from product URL if variants are present on the website
     */
    function fetchVariants () {
      const variantSelector = document.querySelectorAll('div[class="color-block"] div[class="owl-item"] a');
      const variantIdArray = [];
      const getVariantIdRegex = /.*ref\/(\d+)/gm;
      if (variantSelector.length) {
        const productURL = window.location.href;
        const currentVariant = productURL.replace(getVariantIdRegex, '$1');
        variantIdArray.push(currentVariant);
      }
      for (let i = 0; i < variantSelector.length; i++) {
        const variantURL = variantSelector[i].href;
        const variantId = variantURL.replace(getVariantIdRegex, '$1');
        variantIdArray.push(variantId);
      }

      // Add to DOM if variants are present
      if (variantSelector.length) {
        addHiddenDiv('added_variant', variantIdArray.join(' | '));
        addHiddenDiv('added_variantCount', variantIdArray.length);
      }
    }

    /**
     * Fetching availability text. If add to cart button appears on the website then it is in stock
     */
    function fetchAvailabilityText () {
      // Added xpath for product not available 
      const availabilityTextFlag = document.evaluate('//div[@class="informations"]//div[contains(@class, "off") and contains(@class, "onlinePurchase")]//*[contains(text(), "Ajouter au panier")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const availabilityText = availabilityTextFlag ? 'Out of stock' : 'In stock';
      addHiddenDiv('added_availabilityText', availabilityText);
    }

    function fetchTechnicalInfo () {
      const technicalInfoSelector = document.querySelector('div[id="about"]');
      const technicalInfoFlag = technicalInfoSelector ? 'Yes' : 'No';
      addHiddenDiv('added_technicalInfo', technicalInfoFlag);
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
    fetchVariants();
    fetchAvailabilityText();
    fetchTechnicalInfo();

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.evaluate('//div[@id="presentation"]//div[@itemprop="description"]//img/@src | //div[@id="presentation"]//div[@itemprop="description"]//video/@src', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const descriptionSelector = document.querySelector('div[id="presentation"] div[itemprop="description"]');
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    const specDescriptionSelector = document.evaluate('//th[contains(text(), "Description")]/parent::tr/parent::thead/following-sibling::tbody[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const specDescription = specDescriptionSelector ? specDescriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
      specDescription && addHiddenDiv('added-description', specDescription);
    } else {
      if (description && specDescription) {
        description = description + ' | ' + specDescription;
      } else {
        description = description + specDescription;
      }
      addHiddenDiv('added-description', description);
    }
  }, [inputs.url]);

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
