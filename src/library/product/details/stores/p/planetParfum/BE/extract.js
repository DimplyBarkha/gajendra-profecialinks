const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'planetParfum',
    transform: cleanUp,
    domain: 'planetparfum.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function() {
      if(document.querySelector('.no-result')) {
        throw new Error('Not a product page');
      }
    });

    const numOfVariants = await context.evaluate(async () => document.querySelectorAll('div.volume-row.clearfix, li.variation-value').length);
    const iterations = numOfVariants || 1;
    for (let i = 1; i <= iterations; i++) {
      if (numOfVariants) {
        await context.waitForSelector(`div.volume-row.clearfix:nth-of-type(${i}) label, li.variation-value:nth-of-type(${i}) a`);
        await context.click(`div.volume-row.clearfix:nth-of-type(${i}) label, li.variation-value:nth-of-type(${i}) a`);
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      await context.evaluate(
        async ({ i }) => {
          function getEleByXpath(xpath) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const text = element ? element.textContent : null;
            return text;
          };
          const addedVariant = document.createElement('div');
          addedVariant.id = `addedVariant${i}`;
          addedVariant.style.display = 'none';
          const listPriceRow = document.querySelector('div.desktop-availability-price.clearfix span.price-standard, div.desktop-availability-price.clearfix span.price-standard');
          const listPrice = listPriceRow ? listPriceRow.textContent : '';
          const priceRow = document.querySelector('div.desktop-availability-price.clearfix span.price-sales-with-standard, div.desktop-availability-price.clearfix span.price-sales');
          const price = priceRow ? priceRow.innerText : '';

          addedVariant.setAttribute('price', price);
          addedVariant.setAttribute('list_price', listPrice);

          const promotion = getEleByXpath('//div[@class="pdp-flag-discount-rate"]');
          const promotionText = promotion ? promotion.trim() : '';
          addedVariant.setAttribute('promotion_text', promotionText);

          const description = document.querySelector('dl.accordion p.description.long');
          const descriptionBullets = description ? description.innerText.match(new RegExp(/\n•/, 'g')) : '';
          const descriptionBulletsCount = descriptionBullets ? descriptionBullets.length : '';
          addedVariant.setAttribute('description_bullets_count', descriptionBulletsCount);

          const productInfoElem = document.querySelector('input#pid');
          const upcValue = productInfoElem ? productInfoElem.getAttribute('value') : '';
          addedVariant.setAttribute('upc_value', upcValue);

          const linkElem = document.querySelector('link[rel="canonical"]');
          const productUrl = linkElem ? linkElem.getAttribute('href') : '';
          const productSku = productUrl ? productUrl.replace(/.+\/(.+)\.html/, '$1') : '';
          addedVariant.setAttribute('product_sku_id', productSku);

          const productLinkElem = getEleByXpath('//span[@itemprop="url"]');
          const productLink = productLinkElem || window.location.href;
          if (productLink) addedVariant.setAttribute('product_link_url', productLink);

          const ingrediens = getEleByXpath('//span[@class="ingredient"]');
          const ingrediensList = ingrediens || '';
          if (ingrediensList) addedVariant.setAttribute('ingredient_list', ingrediensList);

          const availabilityElem = document.querySelector('div.availability p.in-stock-msg');
          const availabilityText = availabilityElem ? 'In Stock' : 'Out Of Stock';
          addedVariant.setAttribute('availability_text', availabilityText);

          const mainImage = getEleByXpath('//div[@id="thumbnails"]//li[position()=1]//img/@data-lgimg');
          const matchRegEx = /{"url":"(.+.jpg)/;
          const productImg = mainImage && mainImage.match(matchRegEx) ? mainImage.match(matchRegEx)[1] : '';
          const productImgAlt = getEleByXpath('//div[@id="thumbnails"]//li[position()=1]//img/@alt');
          const alternateImages = [];

          const allImages = document.querySelectorAll('div#thumbnails li img');
          for (let i = 1; i < allImages.length; i++) {
            const alterImage = allImages[i].dataset.lgimg ? allImages[i].dataset.lgimg : null;
            const matchUrl = alterImage ? alterImage.match(matchRegEx) : null;
            const imageUrl = matchUrl ? matchUrl[1] : '';
            alternateImages.push(imageUrl);
          };
          if (productImg) addedVariant.setAttribute('product_img', productImg);
          if (productImgAlt) addedVariant.setAttribute('product_img_alt', productImgAlt);
          if (alternateImages.length) {
            alternateImages.map(image => {
              const secondaryImageLink = document.createElement('a');
              secondaryImageLink.setAttribute('class', 'alternateImages');
              secondaryImageLink.setAttribute('href', image);
              addedVariant.appendChild(secondaryImageLink);
            });
          }

          const variantElement = document.querySelector('a.select-color-element.swatchanchor.selected, div.volume-row.clearfix.selected div.variation-description');
          const variantName = variantElement ? variantElement.textContent.trim() : '';

          const brand = document.querySelector('h2.title.product-brand') ? document.querySelector('h2.title.product-brand').textContent.trim() : null;
          const productName = document.querySelector('h1.title.product-name') ? document.querySelector('h1.title.product-name').textContent.trim() : null;
          const productSubname = document.querySelector('h2.subtitle') ? document.querySelector('h2.subtitle').textContent.trim() : null;
          let nameExtended = [];
          if (brand && productName && productSubname) {
            nameExtended = [brand, productName, productSubname];
          } else if (!brand && productName && productSubname) {
            nameExtended = [productName, productSubname];
          } else if (brand && productName && !productSubname) {
            nameExtended = [brand, productName];
          } else if (brand && !productName && productSubname) {
            nameExtended = [brand, productSubname];
          } else nameExtended = [];

          if (variantName) nameExtended.push(variantName);

          const nameExtendedText = nameExtended.length ? nameExtended.join(' - ') : '';

          addedVariant.setAttribute('name_extended', nameExtendedText);

          const vainantIdElem = document.querySelector('div.product-variations.attributes');
          const variantIdData = vainantIdElem ? vainantIdElem.getAttribute('data-current') : null;
          const variantIdJson = variantIdData ? JSON.parse(variantIdData) : null;
          // let variantId;
          // if (variantIdJson && variantIdJson.volume && variantIdJson.volume.value) {
          //   variantId = variantIdJson.volume.value.replace('var_', '');
          // } else if (variantIdJson && variantIdJson.color && variantIdJson.color.value) {
          //   variantId = variantIdJson.color.value.replace('var_', '');
          // } else variantId = '';

          const selectedVariant = "li.variation-value.selected a"; // multiple variants
          const singleVariant = ".product-image img" //for single variant
          let variant_info = null;
          let variant_id = null;
          if (document.querySelector(selectedVariant)) {
            const selectedVariantNode = document.querySelector(selectedVariant);
            if (selectedVariantNode.hasAttribute('data-lgimg')) {
              variant_id = selectedVariantNode.getAttribute('data-lgimg').replace(/(.+)\/(.+)\.jpg(.+)/g, "$2");
            }
            if (variant_id && selectedVariantNode.hasAttribute('title')) {
              variant_info = selectedVariantNode.getAttribute('title') + " - " + variant_id;
            }
          } 
          
          else if(document.querySelector('.variant-dropdown div.selected')) {
            let variantNode = document.querySelector('.variant-dropdown div.selected');
            if(variantNode.querySelector('input') && variantNode.querySelector('input').hasAttribute('data-lgimg')) {
              variant_id = variantNode.querySelector('input').getAttribute('data-lgimg').replace(/(.+)\/(.+)\.jpg(.+)/g, "$2");
              if(variantNode.querySelector('.variation-description')) {
                variant_info = variantNode.querySelector('.variation-description').innerText.trim() + " - " + variant_id;
              }
            }
          }
          else {
            if (document.querySelector(singleVariant)) {
              if (document.querySelector(singleVariant).hasAttribute('src')) {
                variant_id = document.querySelector(singleVariant).getAttribute('src').replace(/(.+)\/(.+)\.jpg(.+)/g, "$2");
              }
              if (variant_id) {
                if (document.querySelector(singleVariant).hasAttribute('title')) {
                  variant_info = document.querySelector(singleVariant).getAttribute('title') + " - " + variant_id;
                }
              }
            }
          }

          console.log(variant_id, variant_info)

          addedVariant.setAttribute('variant_id', variant_id);
          addedVariant.setAttribute('variantInfo', variant_info);

          const quantityElement = document.querySelector('div.product-contents');
          const quantityText = quantityElement ? quantityElement.textContent.trim() : '';
          addedVariant.setAttribute('quantity_text', quantityText);

          const color = document.querySelector('a.select-color-element.swatchanchor.selected');
          const colorText = color ? color.textContent.trim() : '';
          const colorCode = document.querySelector('span.swatchanchor.selected.bubble span.color-bubble') ? document.querySelector(
            'span.swatchanchor.selected.bubble span.color-bubble').getAttribute('style') : '';
          const colorCodeTxt = colorCode ? colorCode.replace(/background-color: /, '').replace(/;/, '') : '';

          addedVariant.setAttribute('color_text', colorText);
          addedVariant.setAttribute('color_code_txt', colorCodeTxt);

          const brandLink = document.querySelector('div.brand-logo a') ? document.querySelector('div.brand-logo a').getAttribute('href') : '';
          const brandLinkText = brandLink ? 'https://www.planetparfum.com' + brandLink : '';
          addedVariant.setAttribute('brand_link', brandLinkText);

          const pricePerUnit = document.querySelector('p.per-litre');
          const pricePerUnitText = pricePerUnit ? pricePerUnit.innerText : '';
          const procePerUnitValue = pricePerUnitText ? pricePerUnitText.replace(/Prix par litre:(.*)/, '$1') : '';
          const productUnit = document.querySelector('p.per-litre b');
          const productUnitText = productUnit ? productUnit.textContent : '';
          const pricePerUnitUom = productUnitText ? productUnitText.replace(/Prix par (.+):/, '$1') : '';
          addedVariant.setAttribute('price_per_unit', procePerUnitValue);
          addedVariant.setAttribute('price_per_unit_uom', pricePerUnitUom);

          document.body.appendChild(addedVariant);
        },
        { i },
      );
    }

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.extract(productDetails, { transform });
  },
};
