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
          function getEleByXpath (xpath) {
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
          addedVariant.setAttribute('listPrice', listPrice);

          const availabilityElem = document.querySelector('div.availability p.in-stock-msg');
          const availabilityText = availabilityElem ? 'In stock' : 'Out of Stock';
          addedVariant.setAttribute('availabilityText', availabilityText);

          const mainImage = getEleByXpath('//div[@id="thumbnails"]//li[position()=1]//img/@data-lgimg');
          const matchRegEx = /{"url":"(.+)", "title/;
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
          if (productImg) addedVariant.setAttribute('productImg', productImg);
          if (productImgAlt) addedVariant.setAttribute('productImgAlt', productImgAlt);
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

          const brand = document.querySelector('h2.title.product-brand') ? document.querySelector('h2.title.product-brand').textContent.trim() : '';
          const productName = document.querySelector('h1.title.product-name') ? document.querySelector('h1.title.product-name').textContent.trim() : '';
          const productSubname = document.querySelector('h2.subtitle') ? document.querySelector('h2.subtitle').textContent.trim() : '';
          const nameExtended = [brand, productName, productSubname];
          if (variantName) nameExtended.push(variantName);
          addedVariant.setAttribute('name_extended', nameExtended.join(' - '));

          addedVariant.setAttribute('variant_id', variantName.trim());

          const quantityElement = document.querySelector('div.product-contents');
          const quantityText = quantityElement ? quantityElement.textContent.trim() : '';
          addedVariant.setAttribute('quantityText', quantityText);

          const color = document.querySelector('a.select-color-element.swatchanchor.selected');
          const colorText = color ? color.textContent.trim() : '';
          const colorCode = document.querySelector('span.swatchanchor.selected.bubble span.color-bubble') ? document.querySelector(
            'span.swatchanchor.selected.bubble span.color-bubble').getAttribute('style') : '';
          const colorCodeTxt = colorCode ? colorCode.replace(/background-color: /, '').replace(/;/, '') : '';

          addedVariant.setAttribute('colorText', colorText);
          addedVariant.setAttribute('colorCodeTxt', colorCodeTxt);

          const brandLink = document.querySelector('div.brand-logo a') ? document.querySelector('div.brand-logo a').getAttribute('href') : '';
          const brandLinkText = brandLink ? 'https://www.planetparfum.com' + brandLink : '';
          addedVariant.setAttribute('brandLink', brandLinkText);

          const pricePerUnit = document.querySelector('p.per-litre b');
          const pricePerUnitText = pricePerUnit ? pricePerUnit.textContent : '';
          const pricePerUnitUom = pricePerUnitText ? pricePerUnitText.replace(/Prix par (.+):/, '$1') : '';
          addedVariant.setAttribute('pricePerUnitUom', pricePerUnitUom);

          document.body.appendChild(addedVariant);
        },
        { i },
      );
    }

    await context.extract(productDetails, { transform });
  },
};
