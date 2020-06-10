
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 3e3));

  // click nutrition info button to view nutr facts, ingred, disclaimer
  await context.evaluate(async function () {
    const overlay = document.getElementsByClassName('ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers')[0];

    // change overlay to nodelist and double check before click
    if (overlay != null) {
      overlay.click();
    }
  });

  await context.waitForSelector('div.ProductCard-imageBlock a');

  await context.evaluate(() => {
    const firstItem = document.querySelector('div.ProductCard-imageBlock a');
    firstItem.click();
  });

  await context.waitForSelector('div.ProductDetails-header');

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

      const descriptionItem = document.getElementsByClassName('RomanceDescription overflow-x-hidden');
      if (descriptionItem[0]) {
        const descriptionText = descriptionItem[0].textContent;
        addHiddenDiv('description', descriptionText);
      }
    }

    await new Promise((resolve, reject) => setTimeout(resolve, 8e3));
    const button = document.getElementsByClassName('kds-Tabs-tab')[1];

    if (button != null && button.textContent === 'Nutrition Info') {
      button.click();
      // click read more button to expand text
      const readMore = document.querySelectorAll('.NutritionIngredients-Disclaimer')[0].children[1].children;

      const aElement = readMore[0];
      if (aElement != null) {
        aElement.click();
      } else {
        console.log('cannot read more');
      }
    } else {
      console.log('not clicking');
    }
  });

  // set url
  await context.evaluate(function () {
    const myURL = document.createElement('li');
    myURL.classList.add('ii_url');
    myURL.textContent = window.location.href;
    myURL.style.display = 'none';
    document.body.append(myURL);
  });

  // search price and check if discount or not
  await context.evaluate(() => {
    const listPrice = document.createElement('li');
    listPrice.classList.add('my-list-price');
    listPrice.style.display = 'none';

    const price = document.createElement('li');
    price.classList.add('my-price');
    price.style.display = 'none';

    const pickupPrice = document.getElementsByClassName('mt-4 flex flex-col items-end')[0];

    if (pickupPrice) {
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

  // check pickup && delivery availability
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
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: null,
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
