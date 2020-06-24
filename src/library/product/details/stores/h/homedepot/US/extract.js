const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform,
    domain: 'homedepot.com',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const RegularSite = await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const nameExtendedSelector = document.querySelector('meta[itemprop="name"]');
      if (!nameExtendedSelector) {
        const nameExtendedSelectorNew = document.querySelector('meta[property="og:title"]');
        const nameExtended = nameExtendedSelectorNew ? nameExtendedSelectorNew.getAttribute('content') : '';
        const newDiv = document.createElement('meta');
        newDiv.setAttribute('itemprop', 'name');
        newDiv.content = nameExtended;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // availability Check
      let availabilityText = 'In Stock';
      const discontinuedMsg = document.evaluate('//span[contains(text(),"Discontinued")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (discontinuedMsg) {
        availabilityText = 'Discontinued';
      }
      const addToCartCheck = document.evaluate('//div[@class="buybelt-wrapper"]//*[normalize-space(text())="Add to Cart"] | //div[@class="buybox"]//*[normalize-space(text())="Add to Cart"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (addToCartCheck) {
        // @ts-ignore
        if (addToCartCheck.parentElement && addToCartCheck.parentElement.disabled) {
          availabilityText = 'Out Of Stock';
        }
      } else {
        availabilityText = 'Out Of Stock';
      }

      addHiddenDiv('custom_availability_text', availabilityText);

      const regularSite = document.querySelector('div#thumbnails');
      if (!regularSite) {
        const imgExpander = document.querySelector('span.mediagallery__thumbnailicons--count');
        if (imgExpander) {
          // @ts-ignore
          imgExpander.click();
        } else {
          document.querySelectorAll('div[class="mediagallery__thumbnails"] img').forEach((img, index) => {
            // @ts-ignore
            !img.src.includes('videoId') && addHiddenDiv(`altImage${index}`, img.src);
          });
        }
        return !!imgExpander;
      }
    });
    if (RegularSite) {
      try {
        await context.waitForXPath('//div[@class="overlay__side-content__product-images"]//img');
      } catch (error) {
        console.log('Error');
      }
    }
    return await context.extract(productDetails, { transform });
  },
};
