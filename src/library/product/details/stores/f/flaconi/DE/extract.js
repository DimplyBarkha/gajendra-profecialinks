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
async function implementation (
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
  await context.evaluate(async (parentInput) => {
    const dataMore = document.querySelector('.instruction');
    if (dataMore) {
      const splits = dataMore.textContent.split('Mehr anzeigen');
      let desc = splits[0];
      if (splits[1]) {
        desc = desc + splits[1];
      }
      document.body.setAttribute('desc', desc);
    }

    function addElementToDocument (key, value) {
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
    console.log('\nSKU\n' + sku);
    const sku2List = document.querySelectorAll('meta[itemprop="sku"]');
    let sku2;
    if (!sku && sku2List) {
      // @ts-ignore
      sku = sku2List[0].content;
    }
    addElementToDocument('product-sku', sku);
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
    // Code for updp
    // await context.evaluate(() => {
    //     const updp = document.evaluate(
    //         '//div[contains(@class,"related-products")]//a',
    //         document,
    //         null,
    //         XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    //         null
    //     );
    //     let text = '';
    //     const brandText = []
    //     const nameExt = []
    //     const type = []
    //     for (let i = 0; i < updp.snapshotLength; i++) {
    //         const z = updp.snapshotItem(i);
    //         // @ts-ignore
    //         const p = z.querySelector('span.brand').innerText;
    //         // @ts-ignore
    //         const q = z.querySelector('span.series').innerText;
    //         // @ts-ignore
    //         const r = z.querySelector('span.type').innerText;
    //         brandText.push(p);
    //         nameExt.push(q);
    //         type.push(r);
    //         text += text ? ` || ${brandText[i]} ${nameExt[i]} ${type[i]}` : `${brandText[i]} ${nameExt[i]} ${type[i]}`;

    //     }
    //     document.body.setAttribute("updp-name", text);
    // })
    const addToCartBtn = document.querySelectorAll('div.add-to-cart button');
    let availability = 'In Stock';
    if (addToCartBtn.length === 1) {
      if (addToCartBtn[0].getAttribute('class').includes('not-available')) {
        availability = 'Out of Stock';
      }
    } else if (addToCartBtn.length > 1) {
      const btn = document.evaluate('//div[contains(@class,"add-to-cart paragraph")and not(contains(@style,"none"))]//button[contains(@class,"not-available")] ', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (btn) {
        availability = 'Out of Stock';
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

    /* Old description */
    // let description = document.querySelector("div[itemprop='description']");
    // // @ts-ignore
    // description = description ? description.innerHTML : '';
    // let descArr = [];
    // // @ts-ignore
    // if (description !== '') {
    //   // @ts-ignore
    //   description = description ? description.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/\s{2,}/, ' ').trim() : '';
    //   descArr.push(description);
    // }
    // // let bulletsDescription = document.querySelectorAll("div.product-description ul li");
    // const bulletsDescription = document.querySelectorAll('ul.product-properties-list li');
    // for (let index = 0; index < bulletsDescription.length; index++) {
    //   let element = bulletsDescription[index];
    //   // @ts-ignore
    //   element = element ? element.innerText.replace(/(\s*[\r\n]\s*)+/g, ' ') : '';
    //   descArr.push(element);
    // }
    // // @ts-ignore
    // descArr = descArr.join(' || ');
    // addElementToDocument('bb_descriptionBullets', descArr);

    const description = document.querySelector(".product-description div[itemprop='description']");
    let descText = '';
    if (description) {
      const linkOpen = description.querySelector('.link-open');
      if (linkOpen) {
        linkOpen.remove();
      }
      // @ts-ignore
      descText = description.innerText;
    }
    const bullets = document.querySelector(".product-description ul[class*='product-properties']");
    let bulletsText = '';
    if (bullets) {
      // @ts-ignore
      const lis = [...bullets.querySelectorAll('li')];
      lis.forEach(li => {
        bulletsText = bulletsText + (bulletsText ? ' || ' : '') + li.innerText;
      });
    }
    let additionalDesc = '';
    if (bulletsText) {
      additionalDesc = descText + ' || ' + bulletsText;
    } else {
      additionalDesc = descText;
    }
    addElementToDocument('additional-description', additionalDesc);
    addElementToDocument('desc-bullets', bulletsText);
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
    const cookiesPopupPresent = await context.evaluate(()=>{
        return !!document.querySelector('button#uc-btn-accept-banner');
    });

    if (cookiesPopupPresent){
        await context.click('button#uc-btn-accept-banner',{ timeout:6000 });
    }

    await context.waitForXPath('//div[contains(@class,"related-products")]/div[contains(@class,"tab-content")]//div[@role="option"]', { timeout:15000 })
        .catch(() => console.log('No uninterruptedPDP for item'))

  return await context.extract(productDetails, { transform });
}
