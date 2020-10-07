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

        const variantContainerLeftPan = document.querySelector('div.rd__product-details__picker__list');
        if (variantContainerLeftPan) {
          let initialVairantTobeClicked = null;
          let initialVariant = document.querySelector('div.rd__product-details__picker-dropdown__collapse-title  img');
          if(initialVariant !== null){
            let initialVariantIdentifier = initialVariant.getAttribute('alt');
            initialVairantTobeClicked = getEleByXpath(`//div[@data-wt-content="changeVariantColor"]//img[contains(@alt, '${initialVariantIdentifier}')]`)
          }
  
          const variants = variantContainerLeftPan.querySelectorAll('div.rd__product-details__picker__list__item');
          for (var i = 0; i < variants.length; i++) {
            variants[i].click();
            addHiddenDiv('variantId', window.location.href)
          }

          if(initialVairantTobeClicked !== null){
            initialVairantTobeClicked.click();
          }
        }

        const variantContainerRightPan = document.querySelector('div.rd__product-details__options__price.rd__product-details__options__price--size');
          if (variantContainerRightPan) {
            let initialVairantTobeClicked = null;
            initialVairantTobeClicked = getEleByXpath(`//div[contains(@class, 'rd__product-details__options__price__item--selected')]`)
            const variants = variantContainerRightPan.querySelectorAll('div.rd__product-details__options__price__item');
              for (var i = 0; i < variants.length; i++) {
                variants[i].click();
                  addHiddenDiv('variantId', window.location.href)
              }
        
              if(initialVairantTobeClicked !== null){
                initialVairantTobeClicked.click();
              }
          }



      function getEleByXpath(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return element;
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
