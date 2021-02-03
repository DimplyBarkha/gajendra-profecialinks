const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    transform: cleanUp,
    domain: 'petsmart.ca',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    var dataRef = [];
    // extracting single product/variant data
    const extractSingleProductData = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const doesProductExist = await context.evaluate(async () => {
        return document.querySelector('h1.pdp-product-name') !== null;
      });
      if (!doesProductExist) return;

      await context.evaluate(async () => {
        const body = document.querySelector('body');

        // getting brand from description tab or product header
        let brand = document
          .evaluate(
            '//b[contains(text(), "Brand:")]/following-sibling::text()[1]',
            document,
            null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
            null,
          )
          .iterateNext();

        if (brand) {
          body.setAttribute('brand', brand.textContent);
        } else {
          brand = document
            .evaluate(
              '//a[@class="brand-details"]',
              document,
              null,
              XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
              null,
            )
            .iterateNext();

          if (brand) {
            body.setAttribute('brand', brand.textContent);
          }
        }

        // getting data from directions tab
        const directionsTab = document
          .evaluate(
            '//li[contains(@class, "react-tabs__tab")]/div[contains(text(), "Directions")]',
            document,
            null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
            null,
          )
          .iterateNext();
        if (directionsTab) {
          // @ts-ignore
          directionsTab.click();
          const directions = document.querySelector('div.react-tabs__tab-content')
            ? document
              .querySelector('div.react-tabs__tab-content')
            // @ts-ignore
              .innerText.split('\n').slice(1).join('\n')
            : '';
          body.setAttribute('directions', directions);
        }

        // getting data from ingredients tab
        const ingredientsTab = document
          .evaluate(
            '//li[contains(@class, "react-tabs__tab")]/div[contains(text(), "Ingredients")]',
            document,
            null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
            null,
          )
          .iterateNext();
        if (ingredientsTab) {
          // @ts-ignore
          ingredientsTab.click();
          const ingredientsXpath = '//p[b[contains(text(), "Ingredients")]]/ancestor::div[@class="react-tabs__tab-content"]';
          const ingredients = document
            .evaluate(ingredientsXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
            .iterateNext()
            ? document
              .evaluate(ingredientsXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
              .iterateNext()
            // @ts-ignore
              .innerText
            : '';
          body.setAttribute('ingredients', ingredients);

          const nutritionalXpath = '//p[b[contains(text(), "Analysis")]]';
          const nutritionalInfo = document
            .evaluate(nutritionalXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
            .iterateNext()
            ? document
              .evaluate(nutritionalXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
              .iterateNext()
            // @ts-ignore
              .innerText.trim()
            : '';
          body.setAttribute('nutritional', nutritionalInfo);
        }

        // getting data from description tab
        const descriptionTab = document
          .evaluate(
            '//li[contains(@class, "react-tabs__tab")]/div[contains(text(), "Description")]',
            document,
            null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
            null,
          )
          .iterateNext();
        if (descriptionTab) {
          // @ts-ignore
          descriptionTab.click();

          const mainDescXPath = document
            .evaluate(
              '//div[contains(@class, "react-tabs__tab-content")]/p[1]/text()',
              document,
              null,
              XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
              null,
            )
            .iterateNext();
          const mainDescAlternateXPath = document
            .evaluate(
              '//div[contains(@class, "react-tabs__tab-content")]/text()',
              document,
              null,
              XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
              null,
            )
            .iterateNext();
          const mainDescriptionElement = mainDescXPath && mainDescXPath.textContent !== ''
            ? mainDescXPath
            : mainDescAlternateXPath;

          const liIterator = document
            .evaluate(
              '//div[contains(@class, "react-tabs__tab-content")]//li/text()',
              document,
              null,
              XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
              null,
            );
          const descriptionLiElements = [];
          let currentLi = liIterator.iterateNext();
          while (currentLi) {
            descriptionLiElements.push(currentLi);
            currentLi = liIterator.iterateNext();
          }
          let descriptionData = '';
          if (mainDescriptionElement) {
            descriptionData += mainDescriptionElement.textContent;
          }
          if (descriptionLiElements.length > 0) {
            descriptionLiElements.forEach(element => {
              if (!element.textContent.includes('Guaranteed Analysis')) {
                descriptionData += ' || ' + element.textContent;
              }
            });
          }
          body.setAttribute('description', descriptionData);
        }

        // gtin
        const jsonWithGtinElement = document.querySelector('head > script[type="application/ld+json"]');
        if (jsonWithGtinElement) {
          const gtin = JSON.parse(jsonWithGtinElement.innerHTML).gtin13
            ? JSON.parse(jsonWithGtinElement.innerHTML).gtin13
            : '';
          body.setAttribute('gtin', gtin);
        }

        // zoom
        const zoomPresent = document.querySelector('div.product-info-row li[data-key="zoomIn"]') ? 'Yes' : 'No';
        body.setAttribute('zoompresent', zoomPresent);

        // const description = document.querySelector('#react-tabs-1 > div > p');
        // if (!description) {
        //   const addDescription = document.querySelector('#react-tabs-1 > div');
        //   if (addDescription) {
        //     body.setAttribute('description', addDescription.textContent);
        //   }
        // }
      });

      dataRef = dataRef.concat(await context.extract(productDetails, { transform }));
    };

    // checking if product has variants
    const variantUrls = await context.evaluate(async () => {
      var variantsData = [];
      const variantElements = document.querySelectorAll('head > script[type="application/ld+json"]');
      variantElements.forEach(variantJSON => {
        const variant = JSON.parse(variantJSON.textContent);
        const url = variant.url;
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

    dataRef.forEach((row, index) => {
      // formatting nutritional information
      const nutritionalInfoFormatter = path => {
        if (path) {
          path[0].text = path[0].text.match(/(\d+[\d.,]*)/g) ? path[0].text.match(/(\d+[\d.,]*)/g)[0] : '';
        }
      };
      const nutritionalInfoUnitFormatter = path => {
        if (path) {
          path[0].text = path[0].text.match(/\d[^)(\n]+/g)[0].replace(/[\d., ]/g, '');
        }
      };
      for (var field in row.group[0]) {
        if (field.includes('PerServing') && !field.includes('calories') && !field.includes('Uom')) {
          nutritionalInfoFormatter(row.group[0][field]);
        }
      }
      for (var fieldUom in row.group[0]) {
        if (fieldUom.includes('PerServingUom')) {
          nutritionalInfoUnitFormatter(row.group[0][fieldUom]);
        }
      }
      // formatting directions and ingredients
      const directions = row.group[0].directions;
      if (directions && directions[0].text.includes('Ingredients')) {
        const endCharIndex = directions[0].text.indexOf('Ingredients');
        directions[0].text = directions[0].text.slice(0, endCharIndex).trim();
      }
      const ingredients = row.group[0].ingredientsList;
      if (ingredients && (ingredients[0].text.includes('Directions') || ingredients[0].text.includes('Instructions') || ingredients[0].text.includes('Guaranteed Analysis'))) {
        const startCharIndex = ingredients[0].text.includes('Ingredients') ? ingredients[0].text.indexOf('Ingredients') + 12 : 0;
        const endCharIndex = ingredients[0].text.indexOf('Guaranteed Analysis') || -1;
        ingredients[0].text = ingredients[0].text.slice(startCharIndex, endCharIndex).trim();
      }
    });
  },
};
