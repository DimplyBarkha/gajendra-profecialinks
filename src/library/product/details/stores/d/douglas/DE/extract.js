const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform,
    domain: 'douglas.de',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {

        let activeImageXpath = "//div[contains(@class,'rd__product-details-gallery__container is-active')]";
        let activeImage = document.evaluate(activeImageXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (activeImage) {
          const imgAlternate = document.querySelector("div.rd__product-details-gallery__container.is-active img").getAttribute('alt')
          addHiddenDiv('img-alt', imgAlternate)
        }
        let mainImageXpath = "//div[contains(@class, 'rd__product-details-gallery--horizontal')]//img | //div[contains(@class,'rd__product-details-gallery__container') and contains(@class, 'is-active')]//img";
        let mainImage = document.evaluate(mainImageXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (mainImage) { 
          const imgSrc = mainImage.getAttribute('src')
          addHiddenDiv('product_main_image', imgSrc)
        }

        let videoXpath = "//span[contains(@data-wt-content, 'Video.www.douglas.de')]";
        let videoEle = document.evaluate(videoXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (videoEle) {
          videoEle.click();
        }

        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.title = content.substring(content.lastIndexOf('_') + 1, content.lastIndexOf('.'));
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
          return newDiv;
        }
        let url = window.location.href;
        const variantContainer = document.querySelector('div.rd__product-details__picker__list');
        if (variantContainer) {
          const variants = variantContainer.querySelectorAll('div.rd__product-details__picker__list__item');
          for (var i = 0; i < variants.length; i++) {
            variants[i].click();
            addHiddenDiv('variantId', window.location.href)
          }
        }

      function getEleByXpath(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(500);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
