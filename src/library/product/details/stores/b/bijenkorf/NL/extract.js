const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'debijenkorf.nl',
    zipcode: '',
  },

  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(() => {
      const cookiesElement = document.querySelector('button[data-dbk-cookie-cta="accept"]');
      if (cookiesElement) {
        cookiesElement.click();
      }
    });

    async function bindVariants (variantSkus, listSelector, isClick) {
      console.log('variantSkus: ' + variantSkus.length);
      for (let i = 0; i < variantSkus.length; i++) {
        if (i === 0) {
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        }

        if (isClick) {
          await context.evaluate(function (selector, currentSku) {
            document.querySelector(`${selector} div input[value="${currentSku}"]`).click();
          }, listSelector, variantSkus[i]);
          await new Promise((resolve, reject) => setTimeout(resolve, 1500));
        } else {
          await context.select(listSelector, variantSkus[i]);
          await new Promise((resolve, reject) => setTimeout(resolve, 1500));
        }
        await context.evaluate(async function (selector, doesClickExist) {
          const variantUl = document.querySelector('ul.dbk-product-carousel--list');
          const li = document.createElement('li');
          li.setAttribute('class', 'canFetch');
          const skuInfoSpan = document.querySelector('span[itemprop="sku"]');
          const currentSku = skuInfoSpan ? skuInfoSpan.textContent : '';

          let variantInfoSpan;
          let quantityInfoSpan;
          if (!doesClickExist) {
            variantInfoSpan = document.querySelector(`${selector} option[value="${currentSku}"]`);
            if (variantInfoSpan) {
              const variantInfoEle = document.createElement('div');
              const quantityInfoEle = document.createElement('div');
              variantInfoEle.setAttribute('id', 'variantInfo');
              variantInfoEle.textContent = variantInfoSpan.textContent.replace('(Online uitverkocht)', '');
              quantityInfoEle.setAttribute('id', 'quantityInfo');
              quantityInfoEle.textContent = variantInfoSpan.textContent.replace('(Online uitverkocht)', '');
              variantInfoEle.style.visibility = 'hidden';
              quantityInfoEle.style.visibility = 'hidden';
              li.appendChild(variantInfoEle);
              li.appendChild(quantityInfoEle);
            }
          } else {
            quantityInfoSpan = document.querySelector(`${selector} div input[value="${currentSku}"]`);
            if (quantityInfoSpan) {
              const variantInfoEle = document.createElement('div');
              variantInfoEle.setAttribute('id', 'quantityInfo');
              variantInfoEle.textContent = quantityInfoSpan.parentElement.textContent.replace('(Online uitverkocht)', '');
              variantInfoEle.style.visibility = 'hidden';
              li.appendChild(variantInfoEle);
            }
          }

          if (skuInfoSpan) {
            const skuInfoEle = document.createElement('div');
            skuInfoEle.setAttribute('id', 'skuInfo');
            skuInfoEle.textContent = skuInfoSpan.textContent;
            skuInfoEle.style.visibility = 'hidden';

            li.appendChild(skuInfoEle);
          }

          const availabilityInfo = document.querySelector('link[itemprop="availability"]');
          if (availabilityInfo) {
            const availabilityEle = document.createElement('div');
            availabilityEle.setAttribute('id', 'availabilityText');
            availabilityEle.textContent = availabilityInfo.getAttribute('href');
            availabilityEle.style.visibility = 'hidden';

            li.appendChild(availabilityEle);
          }

          const priceInfo = document.querySelector('div.product-element__container span[data-at= "final-price"]');
          if (priceInfo) {
            const priceEle = document.createElement('div');
            priceEle.setAttribute('id', 'priceText');
            priceEle.textContent = priceInfo.textContent;
            priceEle.style.visibility = 'hidden';

            li.appendChild(priceEle);
          }

          const listPriceInfo = document.querySelector('div.product-element__container span[data-at="list-price"]');
          if (listPriceInfo) {
            const priceEle = document.createElement('div');
            priceEle.setAttribute('id', 'listPriceText');
            priceEle.textContent = listPriceInfo.textContent;
            priceEle.style.visibility = 'hidden';

            li.appendChild(priceEle);
          }

          const promotionInfo = document.querySelector('span[data-at="discount-percentage"]');
          if (promotionInfo) {
            const priceEle = document.createElement('div');
            priceEle.setAttribute('id', 'promotionText');
            priceEle.textContent = promotionInfo.textContent;
            priceEle.style.visibility = 'hidden';

            li.appendChild(priceEle);
          }

          const images = document.querySelectorAll('div.dbk-image-gallery--display ul.dbk-image-carousel--list > li  img');
          const secondaryImageCountDiv = document.createElement('div');
          secondaryImageCountDiv.setAttribute('id', 'secondaryImageCount');
          secondaryImageCountDiv.textContent = (images.length - 1).toString();
          secondaryImageCountDiv.style.visibility = 'hidden';
          li.appendChild(secondaryImageCountDiv);

          for (let j = 0; j < images.length; j++) {
            const variantImageDiv = document.createElement('div');
            variantImageDiv.setAttribute('id', 'variantImages');
            variantImageDiv.setAttribute('href', images[j].getAttribute('src'));
            variantImageDiv.setAttribute('alt', images[j].getAttribute('alt'));
            variantImageDiv.setAttribute('position', j.toString());
            variantImageDiv.style.visibility = 'hidden';
            li.appendChild(variantImageDiv);
          }

          variantUl.appendChild(li);
        }, listSelector, isClick);

        // const dummyUl = document.createElement('ul');
        // dummyUl.setAttribute('class', 'dbk-product-carousel--list');
        // const li = document.createElement('li');
        // dummyUl.appendChild(li);
        // const body = document.querySelector('body');
        // body.appendChild(dummyUl);
      }
    }

    await context.evaluate(async function () {
      const specSpan = document.querySelector("button[data-at='expansion-panel-header--Specificaties'");
      if (specSpan) {
        // @ts-ignore
        specSpan.click();
      }
    });

    const variantsListLen = await context.evaluate(async function () {
      return document.querySelectorAll('ul.dbk-product-carousel--list li').length;
    });

    if (variantsListLen > 0) {
      for (let i = 0; i < variantsListLen; i++) {
        if (i === 0) {
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        }
        await context.evaluate(async function (index) {
          const variantsList = document.querySelectorAll('ul.dbk-product-carousel--list li');
          const variantsListEle = variantsList[index];
          const variantToClick = variantsListEle.querySelector('div input');
          variantsListEle.setAttribute('class', 'canFetch');
          if (variantToClick) {
            // @ts-ignore
            variantToClick.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
            const variantInfoSpan = document.querySelector('p.dbk-product-indicator span.dbk-product-indicator--value, span.dbk-product-indicator--value');

            if (variantInfoSpan) {
              const variantInfoEle = document.createElement('div');
              variantInfoEle.setAttribute('id', 'variantInfo');
              variantInfoEle.textContent = variantInfoSpan.textContent;
              variantInfoEle.style.visibility = 'hidden';
              variantsListEle.appendChild(variantInfoEle);
            }

            const skuInfoSpan = document.querySelector('span[itemprop="sku"]');

            if (skuInfoSpan) {
              const skuInfoEle = document.createElement('div');
              skuInfoEle.setAttribute('id', 'skuInfo');
              skuInfoEle.textContent = skuInfoSpan.textContent;
              skuInfoEle.style.visibility = 'hidden';

              variantsListEle.appendChild(skuInfoEle);
            }
            const quantityInfoSpan = document.evaluate('//div[contains(., \'Maat\')]/span[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (quantityInfoSpan) {
              const quantityInfoEle = document.createElement('div');
              quantityInfoEle.setAttribute('id', 'quantityInfo');
              quantityInfoEle.textContent = quantityInfoSpan.textContent.replace('(Online uitverkocht)', '');
              quantityInfoEle.style.visibility = 'hidden';
              variantsListEle.appendChild(quantityInfoEle);
            }

            const availabilityInfo = document.querySelector('link[itemprop="availability"]');
            if (availabilityInfo) {
              const availabilityEle = document.createElement('div');
              availabilityEle.setAttribute('id', 'availabilityText');
              availabilityEle.textContent = availabilityInfo.getAttribute('href');
              availabilityEle.style.visibility = 'hidden';

              variantsListEle.appendChild(availabilityEle);
            }

            const priceInfo = document.querySelector('div.product-element__container span[data-at= "final-price"]');
            if (priceInfo) {
              const priceEle = document.createElement('div');
              priceEle.setAttribute('id', 'priceText');
              priceEle.textContent = priceInfo.textContent;
              priceEle.style.visibility = 'hidden';

              variantsListEle.appendChild(priceEle);
            }

            const listPriceInfo = document.querySelector('div.product-element__container span[data-at="list-price"]');
            if (listPriceInfo) {
              const priceEle = document.createElement('div');
              priceEle.setAttribute('id', 'listPriceText');
              priceEle.textContent = listPriceInfo.textContent;
              priceEle.style.visibility = 'hidden';

              variantsListEle.appendChild(priceEle);
            }

            const promotionInfo = document.querySelector('span[data-at="discount-percentage"]');
            if (promotionInfo) {
              const priceEle = document.createElement('div');
              priceEle.setAttribute('id', 'promotionText');
              priceEle.textContent = promotionInfo.textContent;
              priceEle.style.visibility = 'hidden';

              variantsListEle.appendChild(priceEle);
            }

            const images = document.querySelectorAll('div.dbk-image-gallery--display ul.dbk-image-carousel--list > li  img');
            const secondaryImageCountDiv = document.createElement('div');
            secondaryImageCountDiv.setAttribute('id', 'secondaryImageCount');
            secondaryImageCountDiv.textContent = (images.length - 1).toString();
            secondaryImageCountDiv.style.visibility = 'hidden';
            variantsListEle.appendChild(secondaryImageCountDiv);

            for (let j = 0; j < images.length; j++) {
              const variantImageDiv = document.createElement('div');
              variantImageDiv.setAttribute('id', 'variantImages');
              variantImageDiv.setAttribute('href', images[j].getAttribute('src'));
              variantImageDiv.setAttribute('alt', images[j].getAttribute('alt'));
              variantImageDiv.setAttribute('position', j.toString());
              variantImageDiv.style.visibility = 'hidden';
              variantsListEle.appendChild(variantImageDiv);
            }
          }
        }, i);

        async function addQuantityToTheColorVariant (index, isClick) {
          // Ugly hack to remove duplicates in the workbench
          await context.evaluate(async function (eleIndex, doesClickExist) {
            const variantsList = document.querySelectorAll('ul.dbk-product-carousel--list li');
            const li = variantsList[eleIndex];
            let quantityInfoSpan;
            if (doesClickExist) {
              quantityInfoSpan = document.querySelector('div[data-at="thumbnails-size"] ul li');
              li.querySelector('#variantInfo').textContent = quantityInfoSpan.querySelector('div input').getAttribute('value');
              li.querySelector('#skuInfo').textContent = quantityInfoSpan.querySelector('div input').getAttribute('value');
            } else {
              quantityInfoSpan = document.querySelector('div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select option[data-testid]');
              li.querySelector('#variantInfo').textContent = quantityInfoSpan.getAttribute('value');
              li.querySelector('#skuInfo').textContent = quantityInfoSpan.getAttribute('value');
            }
            const quantityInfoEle = document.createElement('div');
            quantityInfoEle.setAttribute('id', 'quantityInfo');
            quantityInfoEle.textContent = quantityInfoSpan.textContent.replace('(Online uitverkocht)', '');
            quantityInfoEle.style.visibility = 'hidden';
            li.appendChild(quantityInfoEle);
          }, index, isClick);
        }

        const variantSkus = await context.evaluate(function () {
          const options = document.querySelectorAll('div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select option[data-testid]');
          const skus = [];
          options.forEach(function (option) {
            skus.push(option.getAttribute('value'));
          });
          return skus;
        });

        const variantsSizeList = await context.evaluate(function () {
          const options = document.querySelectorAll('div[data-at="thumbnails-size"] ul li div input');
          const skus = [];
          options.forEach(function (option) {
            skus.push(option.getAttribute('value'));
          });
          return skus;
        });

        if (variantsSizeList.length > 0) {
          await addQuantityToTheColorVariant(i, true);
          await bindVariants(variantsSizeList, 'div[data-at="thumbnails-size"] ul li', true);
        }

        if (variantSkus.length > 0) {
          await addQuantityToTheColorVariant(i);
          await bindVariants(variantSkus, 'div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select', false);
        }
      }
    } else {
      await context.evaluate(async function () {
        const dummyUl = document.createElement('ul');
        dummyUl.setAttribute('class', 'dbk-product-carousel--list');
        // const li = document.createElement('li');
        // dummyUl.appendChild(li);
        const body = document.querySelector('body');
        body.appendChild(dummyUl);
      });

      const variantSkus = await context.evaluate(function () {
        const options = document.querySelectorAll('div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select option[data-testid]');
        const skus = [];
        options.forEach(function (option) {
          skus.push(option.getAttribute('value'));
        });
        return skus;
      });

      const variantsSizeList = await context.evaluate(function () {
        const options = document.querySelectorAll('div[data-at="thumbnails-size"] ul li div input');
        const skus = [];
        options.forEach(function (option) {
          skus.push(option.getAttribute('value'));
        });
        return skus;
      });

      if (variantSkus.length > 0) {
        await bindVariants(variantSkus, 'div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select', false);
      } else if (variantsSizeList.length > 0) {
        await bindVariants(variantsSizeList, 'div[data-at="thumbnails-size"] ul li', true);
      } else {
        context.evaluate(function () {
          const isLiPresent = document.querySelector('ul.dbk-product-carousel--list li');
          if (!isLiPresent) {
            const dummyUl = document.querySelector('ul.dbk-product-carousel--list');
            const li = document.createElement('li');
            dummyUl.appendChild(li);
          }
        });
      }
    }

    async function getRecommendedProducts () {
      const ids = window.location.pathname.match(/([^\-]+)-([^\-]+)$/);
      // Updated version based on what is being used in website. Currently its using older version. 2.34
      const API = `https://ceres-catalog.debijenkorf.nl/catalog/product/show?productCode=${ids[1]}&productVariantCode=${ids[2]}&cached=false&locale=nl_NL&api-version=2.37`;
      let response = await fetch(API);
      let json = await response.json();
      const recommendedAPI = 'https:' + json.data.product.relatedProducts.crossSell.endpoint;
      response = await fetch(recommendedAPI);
      json = await response.json();
      const pdp = json.data.map(elm => elm.product.displayName).join('|');
      document.body.setAttribute('updp', pdp);
    }
    try {
      await context.evaluate(getRecommendedProducts);
    } catch (error) {
      console.log('Error getting PDP', error);
    }
    return await context.extract(productDetails, { transform: transformParam });
  },
};
