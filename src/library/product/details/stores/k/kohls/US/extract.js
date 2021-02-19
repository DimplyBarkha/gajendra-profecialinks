const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const availability = document.querySelector('h3[class="OOSprodNotAvail"]')
      ? 'Out Of Stock'
      : 'In Stock';

    addElementToDocument('availability', availability);

    const iframeVideoEl = document.querySelector('iframe[title="Product Videos"]');
    if (iframeVideoEl) {
      try {
        console.log(iframeVideoEl.contentDocument.querySelector('video[src]'));
        addElementToDocument('iframe_video', iframeVideoEl.contentDocument.querySelector('video[src]').getAttribute('src'));
      } catch (e) {
        console.log('there is no video in iframe');
      }
    }

    const skuScriptEl = document.evaluate("//script[contains(.,'productSKU\":') and not(@id)]", document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (skuScriptEl && /productSKU":"(\d+)",/.test(skuScriptEl)) {
      addElementToDocument('sku_from_script', skuScriptEl.match(/productSKU":"(\d+)",/)[1]);
    }
  });

  const returnVariantDataForRecursion = async () => {
    return await context.evaluate(async () => {
      const variantCategoryArray = [];
      console.log('herereererere');
      if (document.querySelectorAll('div#product-specifications div.product_boss_tmpl > div.pdp-product-color a.color-swatch').length > 0) variantCategoryArray.push({ selector: 'div#product-specifications div.product_boss_tmpl > div.pdp-product-color', length: document.querySelectorAll('div#product-specifications div.product_boss_tmpl > div.pdp-product-color a.color-swatch').length });
     /*  if (document.querySelectorAll('div#product-specifications div.product_boss_tmpl > div.pdp-product-size a.pdp-size-swatch') && document.querySelectorAll('div#product-specifications div.product_boss_tmpl > div.pdp-product-size a.pdp-size-swatch').length > 0) variantCategoryArray.push({ selector: 'div#product-specifications div.product_boss_tmpl > div.pdp-product-size', length: document.querySelectorAll('div#product-specifications div.product_boss_tmpl > div.pdp-product-size a.pdp-size-swatch').length });
      */ if (document.querySelectorAll('div#product-specifications div.product_boss_tmpl select > option[data-skusize]:not([class])').length > 0) variantCategoryArray.push('div#product-specifications div.product_boss_tmpl select > option[data-skusize]:not([class])');
       return variantCategoryArray;
    });
  };

  const clickVariant = async (selector, index, level, dropdownSelector) => {
    await context.evaluate(async ({ selector, index }) => {
      const variantEl = document.querySelector(selector).querySelectorAll('a')[index];
      console.log(variantEl);
      variantEl.click();
    }, { selector, index });
    if (level === 0) {
      if (dropdownSelector) {
        const dropdownOptions = await context.evaluate(async (selector) => {
          const dropdownAppend = document.createElement('div');
          dropdownAppend.id = 'added_dropdown';
          document.body.appendChild(dropdownAppend);
          const optionElements = Array.from(document.querySelectorAll(selector));
          const data = [];
          optionElements.forEach(el => {
            data.push(el.textContent);
          });
          return data;
         /*  for (const el of dropdownOptions) {
            console.log(el.textContent);
            dropdownAppend.textContent = el.textContent;
            await new Promise((resolve) => setTimeout(resolve, 100));
          } */
        }, dropdownSelector);
        for (const el of dropdownOptions) {
          context.evaluate(async (text) => {
            document.querySelector('div#added_dropdown').textContent = text;
          }, { text: el });
          await context.extract(productDetails, { transform });
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } else {
        await context.extract(productDetails, { transform });
      }
    }
  };

  const loopThroughVariants = async (data, dropdownSelector) => {
    const variantCategory = data.shift();
    const selector = variantCategory.selector;
    const length = variantCategory.length;
    console.log('data length rekurencja: ', data.length);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    for (let i = 0; i < length; i++) {
      console.log('IM ON THIS SELECTOR: ', selector);
      console.log(`clicking varaint:${i}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await clickVariant(selector, i, data.length, dropdownSelector);
      if (data.length >= 1) {
        console.log('going below bye');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await loopThroughVariants([...data]);
      }
    }
  };

  // checking if a product has variants and navigating to them
  const checkIfProductHasVariantsAndClickThem = async () => {
    const variantWrappersArray = await returnVariantDataForRecursion();
    const dropdownSelector = typeof variantWrappersArray[variantWrappersArray.length - 1] === 'string' ? variantWrappersArray.pop() : null;
    console.log('data z variantami: ', variantWrappersArray);
   /*  const variantWrapperElementLength = await context.evaluate(async (wrapers) => {
      return document.querySelector(wrapers[0]).querySelectorAll('a').length;
    }, variantWrappersArray);

    const variantWrapperElementLength2 = await context.evaluate(async (wrapers) => {
      return document.querySelector(wrapers[1]).querySelectorAll('a').length;
    }, variantWrappersArray); */
    console.log('length arrayki przed rekurencja: ', variantWrappersArray.length);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await loopThroughVariants(variantWrappersArray, dropdownSelector);

    /* if (variantCategoryAmount > 1) {
      const firstCategoryVariants = await context.evaluate(async () => {
        var firstVariants = [];
        document
          .querySelectorAll('div#multiSkuContainer > div:first-of-type ul li')
          .forEach((variant) => {
            firstVariants.push(variant.innerHTML);
          });
        return firstVariants;
      });
      for (let j = 0; j < firstCategoryVariants.length; j++) {
        await context.evaluate((j) => {
          document
            .querySelectorAll(
              'div#multiSkuContainer > div:first-of-type ul li button',
              // @ts-ignore
            )[j].click();
        }, j);
        await context.waitForNavigation();
        await clickAllVariants(
          variantElements,
          'div#multiSkuContainer > div:last-of-type ul li button',
        );
      }
    } else if (variantCategoryAmount === 1) {
      await clickAllVariants(
        variantElements,
        'div#multiSkuContainer > div:last-of-type ul li button',
      );
    } else {
      await extractSingleProductData();
    } */
  };

  await checkIfProductHasVariantsAndClickThem();
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    transform: cleanUp,
    domain: 'kohls.com',
    zipcode: '',
  },
  implementation,
};
