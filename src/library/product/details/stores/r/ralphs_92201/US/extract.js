const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ralphs_92201',
    transform: null,
    domain: 'ralphs.com',
    zipcode: '92201',
  },
  implementation : async ({ url }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const overlay = document.getElementsByClassName('ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers')[0];
  
      if (overlay !== undefined) {
        overlay.click();
      }
    });

    
    await context.waitForSelector('div.ProductDetails-header');
  
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  
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
  // ProductDetails-header
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
        if (bullets) {
          bullets.forEach((bullet, index) => {
            if (bullet.textContent) {
              index === 0 ? descriptionText += bullet.textContent : descriptionText += ' || ' + bullet.textContent;
            }
          });
        }
  
        addHiddenDiv('description', descriptionText);
      }
  
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const button = document.getElementsByClassName('kds-Tabs-tab')[1];
  
      if (button && button.textContent === 'Nutrition Info') {
        button.click();
      }
  
      const readMore = document.querySelector('p.NutritionIngredients-Disclaimer span a');
  
      if (readMore) {
        readMore.click();
      } else {
        console.log('cannot read more');
      }
  
      const ingredientsEl = document.querySelector('p.NutritionIngredients-Ingredients');
      if (ingredientsEl && ingredientsEl.textContent) {
        let ingredientsText = ingredientsEl.textContent;
        if (ingredientsText.includes('Ingredients')) {
          ingredientsText = ingredientsText.replace('Ingredients', '');
        }
        addHiddenDiv('my-ingredients', ingredientsText);
      }
  
      const allergenEl = document.querySelector('p.NutritionIngredients-Allergens');
      if (allergenEl && allergenEl.textContent) {
        let allergenText = allergenEl.textContent;
        if (allergenText.includes('Allergen Info')) {
          allergenText = allergenText.replace('Allergen Info', '');
        }
        addHiddenDiv('my-allergies', allergenText);
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
          // listPrice.textContent = pickupPriceText;
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
  
      const purchaseOptions = document.getElementsByClassName('flex flex-col items-end');
  
      if (purchaseOptions.length > 0) {
        available.textContent = 'In Stock';
      } else {
        available.textContent = 'Out of Stock';
      }
  
      document.body.append(available);
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
