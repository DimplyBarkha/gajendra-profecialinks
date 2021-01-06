const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: cleanUp,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    var dataRef = [];
    // extracting single product/variant data
    const extractSingleProductData = async () => {
      await context.evaluate(async () => {
        const topDescriptionBullets = document.querySelectorAll('div.productStage__infoText li');
        let generalDescription = '';
        if (topDescriptionBullets && topDescriptionBullets.length > 0) {
          topDescriptionBullets.forEach(descBullet => {
            generalDescription += '||' + descBullet.textContent;
          });
        }
        const bottomDescriptionBox = document.querySelector('div#description-block');
        if (bottomDescriptionBox) {
          const descSubtitles = bottomDescriptionBox.querySelectorAll('div.pdp__contentSection-leftSide > h3');
          const descTexts = bottomDescriptionBox.querySelectorAll('div.pdp__contentSection-leftSide > p');
          let bottomDescData = [];
          let manufacturerDesc = '';
          descSubtitles.forEach((subtitle, index) => {
            bottomDescData = [
              ...bottomDescData,
              {
                title: subtitle.innerHTML,
                text: descTexts[index] ? descTexts[index].innerHTML : '',
              },
            ];
          });
          bottomDescData = bottomDescData.filter(desc => {
            return (!desc.title.includes('Zutaten') && !desc.title.includes('Zubereitung'));
          });
          bottomDescData.forEach(desc => {
            manufacturerDesc += desc.title + ' ' + desc.text + ' ';
          });
          bottomDescriptionBox.setAttribute('manufacturerdesc', manufacturerDesc);
          generalDescription += '|' + manufacturerDesc;
        }
        document.querySelector('body').setAttribute('description', generalDescription);
      });

      dataRef = dataRef.concat(await context.extract(productDetails, { transform }));
    };

    // checking if product has variants
    const checkIfProductHasVariants = async () => {
      const variantUrls = await context.evaluate(async () => {
        var variantsData = [];
        const variantElements = document.querySelectorAll('div.productStage__productVariants li[class*="productStage__variantItem"] > a');
        variantElements.forEach(variant => {
          const url = 'https://www.brack.ch' + variant.getAttribute('href');
          variantsData.push(url);
        });
        return variantsData;
      });
      if (variantUrls && variantUrls.length > 1) {
        for (let i = 0; i < variantUrls.length; i++) {
          await context.goto(variantUrls[i]);
          await extractSingleProductData();
        }
      } else {
        await extractSingleProductData();
      }
    };

    // checking if extractor is on a search results page
    const isOnSearchResultsPage = await context.evaluate(async () => {
      return window.location.href.includes('search?');
    });
    if (isOnSearchResultsPage) {
      const sameRpcProductUrls = await context.evaluate(async () => {
        var productsData = [];
        const sameRpcProductElements = document.querySelectorAll('ul.productList > li.product-card');
        sameRpcProductElements.forEach(element => {
          const url = 'https://www.brack.ch' + (element.querySelector('a.product__overlayLink') ? element.querySelector('a.product__overlayLink').getAttribute('href') : '');
          productsData.push(url);
        });
        return productsData;
      });
      for (let i = 0; i < sameRpcProductUrls.length; i++) {
        await context.goto(sameRpcProductUrls[i]);
        await checkIfProductHasVariants();
      }
    } else {
      await checkIfProductHasVariants();
    }

    dataRef.forEach(row => {
      const alternateImages = row.group[0].alternateImages;
      if (alternateImages) {
        alternateImages.forEach(image => {
          image.text = 'https:' + image.text.replace('xs3', 'xxl');
        });
      }

      const availability = row.group[0].availabilityText;
      if (availability) {
        availability[0].text = availability[0].text.includes('InStock') ? 'In Stock' : 'Out Of Stock';
      }

      const servingSizeUom = row.group[0].servingSizeUom;
      if (servingSizeUom) {
        servingSizeUom[0].text = servingSizeUom[0].text.replace(/\d/g, '');
      }

      const unitFormatter = (fieldPath) => {
        if (fieldPath) {
          fieldPath[0].text = fieldPath[0].text.replace(/[()]/g, '');
        }
      };
      for (var field in row.group[0]) {
        if (field.includes('PerServingUom')) {
          unitFormatter(row.group[0][field]);
        }
      }
    });
  },
};
