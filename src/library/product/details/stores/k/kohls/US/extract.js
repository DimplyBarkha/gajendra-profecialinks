const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const prepareNotChangingData = async () => {
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
      const offersElementSnapshot = document.evaluate('//div[contains(@id,"root_panel")]/div[@itemscope]/div[@itemprop="offers"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      if (offersElementSnapshot && offersElementSnapshot.snapshotLength === 1) {
        const offerElement = document.querySelector('div[itemprop="offers"] > meta[itemprop="sku"]');
        if (offerElement) {
          addElementToDocument('sku_from_single_offer', offerElement.getAttribute('content'));
        }
      } else if (availability === 'Out Of Stock') {
        const offerElement = document.querySelector('div[itemprop="offers"] > meta[itemprop="sku"]');
        if (offerElement) {
          addElementToDocument('sku_from_single_offer', offerElement.getAttribute('content'));
        }
      }
    });
  };

  const extractSingleVariant = async () => {
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const variantColor = document.querySelector('div#product-specifications span.sel-color-swatch') ? document.querySelector('div#product-specifications span.sel-color-swatch').textContent : null;
      let variantSize = document.evaluate("//div[@id='product-specifications']//div[@class='product_boss_tmpl']/div[@class='pdp-product-size']//a[@class='sbSelector']/text()", document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (!variantSize) {
        if (document.querySelector('div#product-specifications span.size-swatch')) {
          variantSize = document.querySelector('div#product-specifications span.size-swatch').textContent;
        }
      }
      let variantInformation = '';
      if (variantColor && variantSize) {
        variantInformation = [variantColor, variantSize].join(' | ');
      } else if (variantColor) {
        variantInformation = variantColor;
        const colorsSkus = document.querySelectorAll('div[itemprop="offers"] > meta[itemprop="sku"]');
        const colorsSkusString = Array.from(colorsSkus).map((el) => el.getAttribute('content')).join(' | ');
        addElementToDocument('color_variants', colorsSkusString);
        addElementToDocument('color_variants_count', colorsSkus.length);
      } else {
        variantInformation = variantSize;
      }

      addElementToDocument('variant_information', variantInformation);

      const firstVariantEl = document.querySelector('div.pdp-main-bazarvoice-ratings > div[data-bv-productid]');
      if (firstVariantEl) {
        addElementToDocument('variant_first', firstVariantEl.getAttribute('data-bv-productid'));
      }
    });
    await context.extract(productDetails, { transform });
  };

  const clickVariantAndExtract = async (selector, index) => {
    await context.evaluate(async ({ selector, index }) => {
      const variantEl = document.querySelectorAll(selector)[index];
      console.log(variantEl);
      await variantEl.click();
      // variants field: only after clicking size we are sure which sku belongs to which size ASK MANAS URL: https://www.kohls.com/product/prd-2891253/adidas-adilette-cloudfoam-womens-ombre-slide-sandals.jsp?color=Cherry%20Metallic
      const variantSKU = document.querySelector('input#addToBagSkuId');
      if (variantSKU) {
        document.querySelector('div#size_variants').textContent += ` ${variantSKU.getAttribute('value')}`;
      }
    }, { selector, index });
    await extractSingleVariant();
  };

  const loopThroughVariants = async (selector) => {
    if (selector) {
      await context.evaluate(async () => {
        const variants = document.createElement('div');
        variants.id = 'size_variants';
        document.body.appendChild(variants);
        const variantsCount = document.createElement('div');
        variantsCount.id = 'size_variants_count';
        document.body.appendChild(variantsCount);
      });

      if (selector.includes('sbSelector')) {
        const length = await context.evaluate((variantSelector) => {
          const variantSizeCount = document.querySelectorAll(`${variantSelector} ~ ul.sbOptions li a[rel]`).length;
          document.querySelector('div#size_variants_count').textContent = variantSizeCount.toString();
          return variantSizeCount;
        }, selector);
        console.log('ilosc dostepnych size: ', length);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        for (let i = 0; i < length; i++) {
          console.log('IM ON THIS SELECTOR: ', selector);
          console.log(`clicking variant:${i}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await clickVariantAndExtract(`${selector} ~ ul.sbOptions li a[rel]`, i);
        }
      } else {
        const length = await context.evaluate((variantSelector) => {
          const variantSizeCount = document.querySelectorAll(`${variantSelector} a.pdp-size-swatch`).length;
          document.querySelector('div#size_variants_count').textContent = variantSizeCount.toString();
          return variantSizeCount;
        }, selector);
        for (let i = 0; i < length; i++) {
          console.log('IM ON THIS SELECTOR: ', selector);
          console.log(`clicking variant:${i}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await clickVariantAndExtract(`${selector} a.pdp-size-swatch`, i);
        }
      }
    }
  };

  const returnVariantWrapperSelector = async () => {
    return await context.evaluate(async () => {
      let variantSizeWrapper = null;
      const buttonsWrapper = 'div#product-specifications div.product_boss_tmpl > div.pdp-product-size > div.pdp-waist-size_info';
      const dropdownWrapper = 'div#product-specifications div.product_boss_tmpl > div.pdp-product-size a.sbSelector';

      if (document.querySelector(buttonsWrapper)) variantSizeWrapper = buttonsWrapper;
      if (document.querySelector(dropdownWrapper)) variantSizeWrapper = dropdownWrapper;
      return variantSizeWrapper;
    });
  };

  // get valid variant size wrapper selector and either loop through sizes or extract product
  const extractData = async () => {
    const variantWrapperSelector = await returnVariantWrapperSelector();
    if (variantWrapperSelector) {
      console.log('wybrany selector: ', variantWrapperSelector);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loopThroughVariants(variantWrapperSelector);
    } else {
      // w tym miejscu albo odpalamy
      const url = await context.evaluate(async () => {
        return window.location.href;
      });
      url.includes('?color') ? await extractSingleVariant() : await context.extract(productDetails, { transform });
    }
  };

  await prepareNotChangingData();
  await extractData();
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
