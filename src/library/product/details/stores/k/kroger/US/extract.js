const { transform } = require('./transform');

const implementation = async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const { url, id, zipcode } = inputs;

  await context.waitForSelector('div.ProductCard a', { timeout: 5000 }).catch(() => console.log('URL given as input, no item to click'));

  await context.click('div.ContainerGrid-header.m-0 div.ProductCard a')
    .catch(() => console.log('URL given as input, no item to click'));

  await context.waitForSelector('div.ProductDetails-header');

  // wait and check for ratings/reviews, loads slowly:
  await context.waitForXPath('//div[@class="bv_avgRating_component_container notranslate"]', { timeout: 9000 })
    .catch(() => console.log('No reviews/ratings for this item'));

  await context.evaluate(async function (url, id, zipcode) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const nutritionButton = document.evaluate('//span[@class="kds-Text--m" and contains(text(),"Nutrition Info")]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
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
    }
  }, url, id, zipcode);

  await context.evaluate(() => {
    const listPrice = document.createElement('li');
    listPrice.classList.add('my-list-price');
    listPrice.style.display = 'none';

    const price = document.createElement('li');
    price.classList.add('my-price');
    price.style.display = 'none';

    const pickupPrice = document.getElementsByClassName('flex flex-col items-end')[0];

    if (pickupPrice !== undefined) {
      const pickupPriceText = pickupPrice.textContent;

      if (pickupPriceText.includes('discount')) {
        const firstDIndex = pickupPriceText.indexOf('d');
        price.textContent = pickupPriceText.slice(0, firstDIndex);

        const mIndex = pickupPriceText.indexOf('m');
        listPrice.textContent = pickupPriceText.slice(mIndex + 1);
      } else {
        price.textContent = pickupPriceText;
      }
    }

    document.body.append(price);
    document.body.append(listPrice);
  });

  await context.evaluate((zipcode) => {
    const available = document.createElement('li');
    available.classList.add('availability');
    available.style.display = 'none';

    const purchaseOptions = document.getElementsByClassName('flex flex-col items-end');
    const numOptions = purchaseOptions.length;

    const shippingAvailable = document.evaluate('count(//span[contains(@class,"PurchaseOptions") and contains(text(),"Ship")]/parent::span/parent::div/following-sibling::div//data)>0', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;

    if (numOptions > 0) {
      // Different requirements for 45232 only
      if (shippingAvailable || zipcode === '45322') {
        available.textContent = 'In Stock';
      } else {
        available.textContent = 'In Store Only';
      }
    } else {
      available.textContent = 'Out of Stock';
    }
    console.log('availabilityText : ' + available.textContent);

    document.body.append(available);
  }, zipcode);
  await context.evaluate(() => {
    Array.from(document.querySelectorAll('[class="NutritionIngredients-Disclaimer"] a'))
      .filter(elm => elm.innerText.includes('Read More')).forEach(elm => elm.click());
  });
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
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
