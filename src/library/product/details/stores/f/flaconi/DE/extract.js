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

  /**
   * Waits for enhancedContent to load
   * enhancedContent sometimes doesn't load, in that case we wait for enhancedContent to load
   * In case enhancedContent doesn't load at first place, it loads sometimes when we reload the page
   */
  const enhancedContent = async () => {
    const cssEnhancedContentDiv = '#product-content-block';
    try {
      await context.waitForSelector(cssEnhancedContentDiv, { timeout: 15000 });
    } catch (error) {
      console.log('Enhanced content not loaded. CSS: ', cssEnhancedContentDiv);
      console.log('Reloading the page');
      await context.reload();
      try {
        await context.waitForSelector(cssEnhancedContentDiv, { timeout: 15000 });
      } catch (error) {
        console.log('Enhanced content not loaded. CSS: ', cssEnhancedContentDiv);
      }
    }
  }
  await enhancedContent();

  await context.evaluate(async () => {
    const dataMore = document.querySelector('.instruction');
    if (dataMore) {
      const splits = dataMore.textContent.split('Mehr anzeigen');
      let desc = splits[0];
      if (splits[1]) {
        desc = desc + splits[1];
      }
      document.body.setAttribute('desc', desc);
    }

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
  const cookiesPopupPresent = await context.evaluate(() => {
    return !!document.querySelector('button#uc-btn-accept-banner');
  });

  if (cookiesPopupPresent) {
    await context.click('button#uc-btn-accept-banner', { timeout: 6000 });
  }

  await context.waitForXPath('//div[contains(@class,"related-products")]/div[contains(@class,"tab-content")]//div[@role="option"]', { timeout: 15000 })
    .catch(() => console.log('No uninterruptedPDP for item'))

  return await context.extract(productDetails, { transform });
}
