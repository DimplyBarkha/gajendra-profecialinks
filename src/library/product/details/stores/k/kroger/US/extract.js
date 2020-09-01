const { myTransform } = require('./transform');

const implementation = async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const { url, id, zipcode } = inputs;

  await context.waitForSelector('div.ProductCard a', { timeout: 5000 });

  await context.click('div.ContainerGrid-header.m-0 div.ProductCard a')
    .catch(() => console.log('URL given as input, no item to click'));

  await context.waitForSelector('div.ProductDetails-header');

  // wait and check for ratings/reviews, loads slowly:
  await context.waitForXPath('//div[@class="bv_avgRating_component_container notranslate"]', { timeout: 9000 })
    .catch(() => console.log('No reviews/ratings for this item'));

  await context.evaluate(async function (url, id) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    let skuCode;
    if (id) {
      skuCode = id;
    } else {
      const urlLength = url.length;
      skuCode = url.slice(urlLength - 13, urlLength);
    }
    addHiddenDiv('my-sku', skuCode);

    const myUrl = window.location.href;
    const hashIdx = myUrl.indexOf('#');
    addHiddenDiv('ii_url', hashIdx === -1 ? myUrl : myUrl.slice(0, hashIdx));

    const productDetailsButton = document.getElementsByClassName('kds-Tabs-tab')[0];

    if (productDetailsButton && productDetailsButton.textContent === 'Product Details') {
      productDetailsButton.click();
    }

    const descriptionItem = document.querySelector('.RomanceDescription.overflow-x-hidden');
    if (descriptionItem) {
      let descriptionText = '';

      const mainDesc = descriptionItem.querySelectorAll('p');
      if (mainDesc) {
        mainDesc.forEach((txtEl, index) => {
          if (txtEl.textContent) {
            index === 0 ? descriptionText += txtEl.textContent : descriptionText += ' ' + txtEl.textContent;
          }
        });
      }

      const bullets = descriptionItem.querySelectorAll('ul li');
      let bulletCount;
      let bulletInfo = '';
      if (bullets && bullets.length > 0) {
        bulletCount = bullets.length;

        bullets.forEach((bullet, index) => {
          if (bullet.textContent) {
            descriptionText += ' || ' + bullet.textContent;
            bulletInfo += ' || ' + bullet.textContent;
          }
        });
      } else {
        bulletCount = '';
      }
      addHiddenDiv('bullet-info', bulletInfo);
      addHiddenDiv('bulletCount', bulletCount);
      addHiddenDiv('description', descriptionText);
    }

    const nutritionButton = document.evaluate('//span[@class="kds-Text--m" and contains(text(),"Nutrition Info")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (nutritionButton) {
      nutritionButton.click();
    }

    const totalCalEl = document.querySelector('div.NutritionLabel-Calories.font-bold.flex.justify-between > span:nth-child(2)');
    const totalFatWithPercent = document.querySelector('span.NutrientDetail-DailyValue.is-macronutrient');

    if (totalCalEl && totalFatWithPercent) {
      const totalFat = totalFatWithPercent.textContent.replace('%', '');
      const totalCal = totalCalEl.textContent;
      const calFromFat = parseFloat(totalFat) * parseFloat(totalCal) * 0.01;
      addHiddenDiv('my-cal-from-fat', calFromFat);
    }

    const readMore = document.querySelector('p.NutritionIngredients-Disclaimer span a');

    if (readMore) {
      readMore.click();
    } else {
      console.log('cannot read more');
    }
  }, url, id);

  await context.evaluate(() => {
    const listPrice = document.createElement('li');
    listPrice.classList.add('my-list-price');
    listPrice.style.display = 'none';

    const price = document.createElement('li');
    price.classList.add('my-price');
    price.style.display = 'none';

    const pickupPrice = document.getElementsByClassName('mt-4 flex flex-col items-end')[0];

    if (pickupPrice !== undefined) {
      const pickupPriceText = pickupPrice.textContent;

      if (pickupPriceText.includes('discount')) {
        const firstDIndex = pickupPriceText.indexOf('d');
        price.textContent = pickupPriceText.slice(0, firstDIndex);

        const mIndex = pickupPriceText.indexOf('m');
        listPrice.textContent = pickupPriceText.slice(mIndex + 1);
      } else {
        price.textContent = pickupPriceText;
        listPrice.textContent = pickupPriceText;
      }
    }

    document.body.append(price);
    document.body.append(listPrice);
  });

  await context.evaluate((zipcode) => {
    const available = document.createElement('li');
    available.classList.add('availability');
    available.style.display = 'none';

    const purchaseOptions = document.getElementsByClassName('mt-4 flex flex-col items-end');
    const numOptions = purchaseOptions.length;

    const shippingAvailable = document.evaluate('count(//span[contains(@class,"PurchaseOptions") and contains(text(),"Ship")]/parent::span/parent::div/following-sibling::div/data)>0', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;

    if (numOptions > 0) {
      console.log(`Given zip:${zipcode}`);
      // Different requirements for 45232 only
      if (numOptions === 3 || shippingAvailable || zipcode !== '45232') {
        available.textContent = 'In Stock';
      } else {
        available.textContent = 'In Store Only';
      }
    } else {
      available.textContent = 'Out of Stock';
    }

    document.body.append(available);
  }, zipcode);

  console.log('ready to extract');

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: myTransform,
    domain: 'kroger.com',
  },
  inputs: [
  ],
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
