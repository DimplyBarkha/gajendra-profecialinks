
 const implementation = async (
    inputs,
    parameters,
    context,
    dependencies,
) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
        const overlay = document.getElementsByClassName('ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers')[0];

        if (overlay !== undefined) {
            overlay.click();
        }
    });

    await context.waitForSelector('div.ProductCard a');

    await context.evaluate(() => {
        const firstItem = document.querySelector('div.ProductCard a');
        firstItem.click();
    });

    await context.waitForSelector('div.ProductDetails-header');

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
        function addHiddenDiv(id, content) {
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
            if (bullets && bullets.length > 0) {
                bulletCount = bullets.length;

                bullets.forEach((bullet, index) => {
                    if (bullet.textContent) {
                        index === 0 ? descriptionText += bullet.textContent : descriptionText += ' || ' + bullet.textContent;
                    }
                });
            } else {
                bulletCount = '';
            }
            addHiddenDiv('bulletCount', bulletCount);

            addHiddenDiv('description', descriptionText);
        }

        await new Promise((resolve, reject) => setTimeout(resolve, 8000));
        const button = document.getElementsByClassName('kds-Tabs-tab')[1];

        if (button && button.textContent === 'Nutrition Info') {
            button.click();
        }

        const totalCalEl = document.querySelector('div.NutritionLabel-Calories.font-bold.flex.justify-between > span:nth-child(2)');
        const totalFatwPercent = document.querySelector('span.NutrientDetail-DailyValue.is-macronutrient');

        if (totalCalEl && totalFatwPercent) {
            const totalFat = totalFatwPercent.textContent.replace('%', '');
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

        const filterText = (cssSelector, textToFilter, newId) => {
            const node = document.querySelector(cssSelector);
            if (node && node.textContent) {
                let myText = node.textContent;
                myText = myText.replace(textToFilter, '');
                addHiddenDiv(newId, myText)
            }
        }

        filterText('p.NutritionIngredients-Disclaimer span', 'Read Less', 'my-legal-disclaimer');
        filterText('p.NutritionIngredients-Ingredients', 'Ingredients', 'my-ingredients');
        filterText('p.NutritionIngredients-Allergens', 'Allergen Info', 'my-allergies');

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

    // return await context.extract(productDetails, { transform });
    return await context.extract('product/details/stores/k/kroger/US/extract', { transform });
}

module.exports = {
    implementation
}