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
    // try {
    //   await context.waitForSelector('div[data-testid="toast"]>div button', { timeout: 30000 });
    //   console.log('reloading button present');
    // } catch (e) {
    //   console.log('page reloading button is not present')
    // }
    await context.evaluate(() => {
      const cookiesElement = document.querySelector('button[data-dbk-cookie-cta="accept"]');
      if (cookiesElement) {
        cookiesElement.click();
      }
    });
    // const checkPresence = async () => {
    //   return await context.evaluate(() => {
    //     if (document.querySelector('div[data-testid="toast"]>div button')) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    // }
    // let flag = true;
    // while (flag == true) {
    //   try {
    //     await context.waitForSelector('div[data-testid="toast"]>div button', { timeout: 30000 });
    //     console.log('reloading button present');
    //   } catch (e) {
    //     console.log('page reloading button is not present')
    //   }
    //   let isPresent = await checkPresence();
    //   if (isPresent) {
    //     flag = true;
    //     console.log('isPresent', isPresent);
    //     if (isPresent) {
    //       await context.click('div[data-testid="toast"]>div button')
    //       console.log('button clicked successfully');
    //       await context.waitForNavigation({ timeout: 20000 });
    //     }
    //   } else {
    //     flag = false;
    //   }
    //   console.log('flag===', flag);
    // }
    await context.evaluate(async function (inputs) {
      const specSpan = document.querySelector("button[data-at='expansion-panel-header--Specificaties'");
      if (specSpan) {
        // @ts-ignore
        specSpan.click();
      }
      const variantsList = document.querySelectorAll('ul.dbk-product-carousel--list li');
      if (variantsList.length > 0) {
        for (let i = 0; i < variantsList.length; i++) {
          if (i === 0) {
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          }
          // @ts-ignore
          const variantToClick = variantsList[i].querySelector('div input');
          variantsList[i].setAttribute('class', 'canFetch');
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
              variantsList[i].appendChild(variantInfoEle);
            }

            const skuInfoSpan = document.querySelector('span[itemprop="sku"]');

            if (skuInfoSpan) {
              const skuInfoEle = document.createElement('div');
              skuInfoEle.setAttribute('id', 'skuInfo');
              skuInfoEle.textContent = skuInfoSpan.textContent;
              skuInfoEle.style.visibility = 'hidden';

              variantsList[i].appendChild(skuInfoEle);
            }

            const availabilityInfo = document.querySelector('link[itemprop="availability"]');
            if (availabilityInfo) {
              const availabilityEle = document.createElement('div');
              availabilityEle.setAttribute('id', 'availabilityText');
              availabilityEle.textContent = availabilityInfo.getAttribute('href');
              availabilityEle.style.visibility = 'hidden';

              variantsList[i].appendChild(availabilityEle);
            }

            const priceInfo = document.querySelector('div.product-element__container span[data-at= "final-price"]');
            if (priceInfo) {
              const priceEle = document.createElement('div');
              priceEle.setAttribute('id', 'priceText');
              priceEle.textContent = priceInfo.textContent;
              priceEle.style.visibility = 'hidden';

              variantsList[i].appendChild(priceEle);
            }

            const listPriceInfo = document.querySelector('div.product-element__container span[data-at="list-price"]');
            if (listPriceInfo) {
              const priceEle = document.createElement('div');
              priceEle.setAttribute('id', 'listPriceText');
              priceEle.textContent = listPriceInfo.textContent;
              priceEle.style.visibility = 'hidden';

              variantsList[i].appendChild(priceEle);
            }

            const promotionInfo = document.querySelector('span[data-at="discount-percentage"]');
            if (promotionInfo) {
              const priceEle = document.createElement('div');
              priceEle.setAttribute('id', 'promotionText');
              priceEle.textContent = promotionInfo.textContent;
              priceEle.style.visibility = 'hidden';

              variantsList[i].appendChild(priceEle);
            }

            const images = document.querySelectorAll('div.dbk-image-gallery--display ul.dbk-image-carousel--list > li  img');
            const secondaryImageCountDiv = document.createElement('div');
            secondaryImageCountDiv.setAttribute('id', 'secondaryImageCount');
            secondaryImageCountDiv.textContent = (images.length - 1).toString();
            secondaryImageCountDiv.style.visibility = 'hidden';
            variantsList[i].appendChild(secondaryImageCountDiv);

            for (let j = 0; j < images.length; j++) {
              const variantImageDiv = document.createElement('div');
              variantImageDiv.setAttribute('id', 'variantImages');
              variantImageDiv.setAttribute('href', images[j].getAttribute('src'));
              variantImageDiv.setAttribute('alt', images[j].getAttribute('alt'));
              variantImageDiv.setAttribute('position', j.toString());
              variantImageDiv.style.visibility = 'hidden';
              variantsList[i].appendChild(variantImageDiv);
            }
          }
        }
      } else {
        const dummyUl = document.createElement('ul');
        dummyUl.setAttribute('class', 'dbk-product-carousel--list');
        // const li = document.createElement('li');
        // dummyUl.appendChild(li);
        const body = document.querySelector('body');
        body.appendChild(dummyUl);
      }
    });

    const variantSkus = await context.evaluate(function () {
      const options = document.querySelectorAll('div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select option[data-testid]');
      const skus = [];
      options.forEach(function (option) {
        skus.push(option.getAttribute('value'));
      });
      return skus;
    });

    const variantsFromImages = await context.evaluate(function () {
      return (document.querySelectorAll('ul.dbk-product-carousel--list li').length);
    });

    console.log('variant skus');
    console.log(variantSkus);
    console.log(variantsFromImages);
    console.log('variant skus');

    if (variantSkus.length > 0) {
      for (let i = 0; i < variantSkus.length; i++) {
        if (i === 0) {
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        }
        await context.select('div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select', variantSkus[i]);
        console.log('do something');
        await context.evaluate(async function () {
          const variantUl = document.querySelector('ul.dbk-product-carousel--list');
          const li = document.createElement('li');
          li.setAttribute('class', 'canFetch');

          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          const skuInfoSpan = document.querySelector('span[itemprop="sku"]');
          const currentSku = skuInfoSpan ? skuInfoSpan.textContent : '';

          const variantInfoSpan = document.querySelector(`div[data-dbk-size-selector] div[class="product-element__container form-element type-select"] select option[value="${currentSku}"]`);
          if (variantInfoSpan) {
            const variantInfoEle = document.createElement('div');
            variantInfoEle.setAttribute('id', 'variantInfo');
            variantInfoEle.textContent = variantInfoSpan.textContent.replace('(Online uitverkocht)', '');
            variantInfoEle.style.visibility = 'hidden';
            li.appendChild(variantInfoEle);
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
        });

        // const dummyUl = document.createElement('ul');
        // dummyUl.setAttribute('class', 'dbk-product-carousel--list');
        // const li = document.createElement('li');
        // dummyUl.appendChild(li);
        // const body = document.querySelector('body');
        // body.appendChild(dummyUl);
      }
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

    // await context.evaluate(async () => {
    //   const reloadPageButton = document.querySelector('div[data-testid="toast"]>div button');
    //   console.log('this is the reloading element=====', reloadPageButton)
    //   // if (reloadPageButton) {
    //   reloadPageButton.click();
    //   await new Promise(res => setTimeout(res, 15000))
    //   // }
    // })
    // try {
    //   await context.waitForSelector('div[data-at="recently-viewed-carousel"]', { timeout: 40000 });
    //   console.log('recently viewed products loaded successfully')
    // } catch (e) {
    //   console.log('product did not laod at all');
    // }
    async function getRecommendedProducts () {
      const ids = window.location.pathname.match(/([^\-]+)-([^\-]+)$/);
      const API = `https://ceres-catalog.debijenkorf.nl/catalog/product/show?productCode=${ids[1]}&productVariantCode=${ids[2]}&cached=false&locale=nl_NL`;
      let response = await fetch(API);
      let json = await response.json();
      const recommendedAPI = 'https:' + json.data.relatedProducts.crossSell.endpoint;
      response = await fetch(recommendedAPI);
      json = await response.json();
      const pdp = json.data.map(elm => elm.product.name).join('|');
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
