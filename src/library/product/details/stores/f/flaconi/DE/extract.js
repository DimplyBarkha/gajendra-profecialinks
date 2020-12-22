const { transform } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'flaconi',
        transform,
        domain: 'flaconi.de',
    },
    implementation,
    // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    //   await context.evaluate(async function () {
    //     function addElementToDocument (key, value) {
    //       const catElement = document.createElement('div');
    //       catElement.id = key;
    //       catElement.textContent = value;
    //       catElement.style.display = 'none';
    //       document.body.appendChild(catElement);
    //     }
    //     function addVideoElementToDocument (key, arr) {
    //       const catElement = document.createElement('div');
    //       catElement.id = key;
    //       for (let i = 0; i < arr.length; i++) {
    //         const videoElement = document.createElement('a');
    //         videoElement.href = arr[i].href;
    //         catElement.appendChild(videoElement);
    //       }
    //       catElement.style.display = 'none';
    //       document.body.appendChild(catElement);
    //     }

    //     const directionelement1 = document.evaluate("//div[contains(@class, 'instruction-content')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //     const directionelement2 = document.evaluate("//div[contains(@class, 'instruction')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //     if (directionelement1) {
    //       addElementToDocument('fl_directioninfo', directionelement1.innerText);
    //     } else if (directionelement2) {
    //       addElementToDocument('fl_directioninfo', directionelement2.innerText);
    //     }

    //     const colorlement = document.evaluate("//ul[@id='makeup-color-list']/li[1]//span/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //     if (colorlement && colorlement.value.indexOf('background-color') > -1) {
    //       const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
    //       addElementToDocument('fl_colorcode', colorCode);
    //     }
    //     const videoarr = document.querySelectorAll('div.lazyYoutube > a[title=""]');
    //     if (videoarr && videoarr.length) {
    //       addVideoElementToDocument('pd_video', videoarr);
    //     }
    //   });
    //   await context.extract(productDetails);
    // },
};
async function implementation(
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    { parentInput },
    parameters,
    context,
    dependencies,
) {
    // @ts-ignore
    const { transform } = parameters;
    // @ts-ignore
    const { productDetails } = dependencies;
    await context.evaluate(async(parentInput) => {

        // const dataMore = document.querySelectorAll('div[data-more-text="Mehr anzeigen"]');
        // dataMore.forEach((b) => { b.textContent = "" });

        function addElementToDocument(key, value) {
            const catElement = document.createElement('div');
            catElement.id = key;
            catElement.textContent = value;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
        }
        const url = window.location.href;
        let sku;
        const sku1 = url ? url.split('=') : '';
        const length = sku1.length;
        if (length > 1) {
            sku = sku1[length - 1];
        }
        const sku2List = document.querySelectorAll('meta[itemprop="sku"]');
        let sku2;
        if (sku2List) {
            // @ts-ignore
            sku = sku2List[0].content;
        }
        const ulVariants = document.querySelectorAll('ul.product-list.multiple-variants li');
        if (ulVariants) {
            for (let index = 0; index < ulVariants.length; index++) {
                const element = ulVariants[index];
                // @ts-ignore
                const datasetSku = ulVariants[index].dataset.sku;
                console.log('datasetSku: ', datasetSku);
                if (sku === datasetSku) {
                    console.log('sku: ', sku);
                    // element.classList.add("selected");
                    // @ts-ignore
                    // element.click();
                }
            }
        }

        const addToCartBtn = document.querySelectorAll('button');
        let availability = 'In Stock';
        let metaAvailability = document.querySelector('meta[itemprop="availability"]');
        if (metaAvailability) {
            let text = metaAvailability.getAttribute('content').match(/\w+$/g)[0];
            if (text === "OutOfStock") {
                availability = "Out of Stock"
            } else if (text === "LimitedAvailability") {
                availability = "Limited Availability"
            }
        }
        addElementToDocument('fl_availabilityText', availability);
        // ---------------------------------------------
        //  let description = document.querySelector("div[class='description-content']");
        //   // @ts-ignore
        //   description = description ? description.innerText : '';
        //   let descArr = [];
        //   // @ts-ignore
        //   if(description !== ''){
        //     descArr.push(description);
        //   }
        //   // let bulletsDescription = document.querySelectorAll("div.product-description ul li");
        //   let bulletsDescription = document.querySelectorAll("ul.product-properties-list li");
        //   console.log('bulletsDescription: ', bulletsDescription);
        //   let bulletCount = bulletsDescription.length;
        //   addElementToDocument('bb_descriptionBulletsCount', bulletCount);
        //   for (let index = 0; index < bulletsDescription.length; index++) {
        //     let element = bulletsDescription[index];
        //     // @ts-ignore
        //     element = element ? element.innerText.replace(/(\s*[\r\n]\s*)+/g, ' ') : '';
        //     descArr.push(element);
        //   }
        //   // @ts-ignore
        //   descArr = descArr.join(' || ');
        //   addElementToDocument('bb_descriptionBullets', descArr);
        // ---------------------------------------------
        let description = document.querySelector("div[class='description-content']");
        // @ts-ignore
        description = description ? description.innerHTML : '';
        let descArr = [];
        // @ts-ignore
        if (description !== '') {
            // @ts-ignore
            description = description ? description.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/\s{2,}/, ' ').trim() : '';
            descArr.push(description);
        }
        // let bulletsDescription = document.querySelectorAll("div.product-description ul li");
        const bulletsDescription = document.querySelectorAll('ul.product-properties-list li');
        for (let index = 0; index < bulletsDescription.length; index++) {
            let element = bulletsDescription[index];
            // @ts-ignore
            element = element ? element.innerText.replace(/(\s*[\r\n]\s*)+/g, ' ') : '';
            descArr.push(element);
        }
        // @ts-ignore
        descArr = descArr.join(' || ');
        addElementToDocument('bb_descriptionBullets', descArr);

        // ------------------------------------------
        let variantAmount = document.querySelector('ul.product-list.multiple-variants li.product-container.variant.selected span.amount');
        if (variantAmount) {
            // @ts-ignore
            variantAmount = variantAmount ? variantAmount.innerText : '';
        } else {
            variantAmount = document.querySelector('ul.product-list li.product-container.variant.visible span.amount');
            // @ts-ignore
            variantAmount = variantAmount ? variantAmount.innerText : '';
            if (!variantAmount) {
                variantAmount = document.querySelector('ul.product-list li.product-container.variant.active.visible span.amount');
                // @ts-ignore
                variantAmount = variantAmount ? variantAmount.innerText : '';
            } else {
                variantAmount = document.querySelector('ul.product-list.multiple-variants li.product-container.variant.selected span.amount');
                // @ts-ignore
                variantAmount = variantAmount ? variantAmount.innerText : '';
            }
        }
        let variantUnit = document.querySelector('ul.product-list.multiple-variants li.product-container.variant.selected span.unit');
        if (variantUnit) {
            // @ts-ignore
            variantUnit = variantUnit ? variantUnit.innerText : '';
        } else {
            variantUnit = document.querySelector('ul.product-list li.product-container.variant.visible span.unit');
            // @ts-ignore
            variantUnit = variantUnit ? variantUnit.innerText : '';
            if (!variantUnit) {
                variantUnit = document.querySelector('ul.product-list li.product-container.variant.active.visible span.unit');
                // @ts-ignore
                variantUnit = variantUnit ? variantUnit.innerText : '';
            } else {
                variantUnit = document.querySelector('ul.product-list.multiple-variants li.product-container.variant.selected span.unit');
                // @ts-ignore
                variantUnit = variantUnit ? variantUnit.innerText : '';
            }
        }

        addElementToDocument('ii_variantInfo', variantAmount + ' ' + variantUnit);
    });
    try {
        await context.evaluate(() => {
            Array.from(document.querySelectorAll('#recommend-related div.item')).forEach(elm => {
                const name = Array.from(elm.querySelectorAll('span')).map(elm => elm.innerText.trim()).join(' ');
                elm.setAttribute('product-name', name);
            });
        });
    } catch (err) {
        console.log('Error adding recommended products');
    }
    return await context.extract(productDetails, { transform });
}