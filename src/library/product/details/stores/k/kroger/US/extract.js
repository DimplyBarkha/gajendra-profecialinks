const { cleanUp } = require('../../../../shared');

const implementation = async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const { url, id } = inputs;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await context.evaluate(async function () {
    const overlay = document.getElementsByClassName('ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers')[0];

    if (overlay !== undefined) {
      overlay.click();
    }
  });

  await context.waitForSelector('div.ProductCard a');

  console.log('Url if given:' + inputs.url);

  if (!url) {
    await context.evaluate(() => {
      const firstItem = document.querySelector('div.ProductCard a');
      firstItem.click();
    });
  }

  await context.evaluate((url, id) => {
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
  }, url, id);

  await context.waitForSelector('div.ProductDetails-header');

  await new Promise((resolve) => setTimeout(resolve, 9000));

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

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

    await new Promise((resolve) => setTimeout(resolve, 8000));
    const button = document.getElementsByClassName('kds-Tabs-tab')[1];

    if (button && button.textContent === 'Nutrition Info') {
      button.click();
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
  });

  await context.evaluate(function () {
    const myURL = document.createElement('li');
    myURL.classList.add('ii_url');
    myURL.textContent = window.location.href;
    myURL.style.display = 'none';
    document.body.append(myURL);
  });

  await context.evaluate(() => {
    const listPrice = document.createElement('li');
    listPrice.classList.add('my-list-price');
    listPrice.style.display = 'none';

    const price = document.createElement('li');
    price.classList.add('my-price');
    price.style.display = 'none';

    const pickupPrice = document.evaluate('//span[contains(@class,"PurchaseOptions--headingLabel") and contains(text(),"Pickup")]//parent::span//parent::div//parent::div/div[@class="mt-4 flex flex-col items-end"]/data', document, null, XPathResult.STRING_TYPE, null).stringValue;

    if (pickupPrice !== undefined) {
      if (pickupPrice.includes('discount')) {
        const firstDIndex = pickupPrice.indexOf('d');
        price.textContent = pickupPrice.slice(0, firstDIndex);

        const listPriceEl = document.querySelector('s.kds-Price-original');
        if (listPriceEl && listPriceEl.textContent) {
          listPrice.textContent = listPriceEl.textContent;
        }
      } else {
        price.textContent = pickupPrice;
        listPrice.textContent = pickupPrice;
      }
    } else {
      price.textContent = 'Product Unavailable';
      listPrice.textContent = 'Product Unavailable';
    }
    document.body.append(price);
    document.body.append(listPrice);
  });

  await context.evaluate(() => {
    const available = document.createElement('li');
    available.classList.add('availability');
    available.style.display = 'none';

    const purchaseOptions = document.getElementsByClassName('mt-4 flex flex-col items-end');

    if (purchaseOptions.length > 0) {
      available.textContent = 'In Stock';
    } else {
      available.textContent = 'Out of Stock';
    }

    document.body.append(available);
  });

  console.log('ready to extract');

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: cleanUp,
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
