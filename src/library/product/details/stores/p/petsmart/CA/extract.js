const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    transform: transform,
    domain: 'petsmart.ca',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      // getting data from directions tab
      const directionsTab = document.querySelector('li#react-tabs-4');
      if (directionsTab) {
        // @ts-ignore
        directionsTab.click();
        const directions = document.querySelector('div.react-tabs__tab-content')
          ? document
            .querySelector('div.react-tabs__tab-content')
            // @ts-ignore
            .innerText.trim()
          : '';
        directionsTab.setAttribute('directions', directions);
      }

      let detailIngredients = document.evaluate(`//div[@class="react-tabs__tab-content"]/b[contains(text(),'Ingredients')]/following-sibling::text() | //div[@class="react-tabs__tab-content"]//p//b[contains(text(),'Ingredients')]/following::text()[1]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (detailIngredients.snapshotLength) {
        let ingredientsList = '';
        for (var i = 0; i < detailIngredients.snapshotLength; i++) {
          ingredientsList = ingredientsList + detailIngredients.snapshotItem(i).textContent;
        }
        if (ingredientsList) {
          document.body.setAttribute('ingredients', ingredientsList);
        }
      }

      // getting data from ingredients tab
      const ingredientsTab = document.querySelector('li#react-tabs-2');
      if (ingredientsTab) {
        // @ts-ignore
        ingredientsTab.click();
        const ingredientsXpath = '//p[b[contains(text(), "Ingredients")]]';
        const ingredients = document.evaluate(ingredientsXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()
          ? document.evaluate(ingredientsXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()
            // @ts-ignore
            .innerText.replace(/Ingredients:\n/g, '')
          : '';
        document.body.setAttribute('ingredients', ingredients);

        const nutritionalXpath = '//p[b[contains(text(), "Analysis")]]';
        const nutritionalInfo = document.evaluate(nutritionalXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()
          ? document.evaluate(nutritionalXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()
            // @ts-ignore
            .innerText.trim()
          : '';
        ingredientsTab.setAttribute('nutritional', nutritionalInfo);

      }

      // going back to main tab to extract data through the yaml file
      const descriptionTab = document.querySelector('li#react-tabs-0');
      if (descriptionTab) {
        // @ts-ignore
        descriptionTab.click();
      }
    });

    await context.evaluate(async () => {
      const body = document.querySelector('body');

      const jsonWithGtinElement = document.querySelector('head > script[type="application/ld+json"]');
      if (jsonWithGtinElement) {
        const gtin = JSON.parse(jsonWithGtinElement.innerHTML).gtin13 ? JSON.parse(jsonWithGtinElement.innerHTML).gtin13 : '';
        body.setAttribute('gtin', gtin);
      }

      const zoomPresent = document.querySelector(
        'div.product-info-row li[data-key="zoomIn"]',
      )
        ? 'Yes'
        : 'No';
      body.setAttribute('zoompresent', zoomPresent);

      let description = document.querySelector("#react-tabs-1 > div > p");
      if (!description) {
        let addDescription = document.querySelector("#react-tabs-1 > div")
        if (addDescription) {
          document.body.setAttribute('description', addDescription.textContent);
        }
      }

      const imageMain = document.evaluate('//div[@class="slick-list"]//div[contains(@class, "slick-slide") and not(contains(@class, "cloned"))]//img/@src', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      if (!imageMain) {
        let shownImage = document.evaluate('//div[@class="react-viewer-canvas"]/img/@src', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        if (shownImage) {
          document.body.setAttribute('shownimage', shownImage.textContent);
        }
      }

    });

    var dataRef = await context.extract(productDetails, { transform });

    var description = dataRef[0].group[0].description;
    if (description && description.length > 1) {
      let fullDescription = '';
      description.forEach((desc) => {
        fullDescription += desc.text + ' ';
      });
      description[0].text = fullDescription;
      description.splice(1);
    }

    const nutritionalInfoFormatter = (path) => {
      if (path) {
        path[0].text = path[0].text.match(/(\d+[\d.]*)/g) ? path[0].text.match(/(\d+[\d.]*)/g)[0] : '';
        // if (path[0].text.indexOf('.') === 0) {
        //   path[0].text = path[0].text.slice(1);
        // }
      }
    };
    for (var field in dataRef[0].group[0]) {
      if (field.includes('PerServing') && !field.includes('calories') && !field.includes('Uom')) {
        nutritionalInfoFormatter(dataRef[0].group[0][field]);
      }
    }
    const nutritionalInfoUnitFormatter = (path) => {
      if (path) {
        path[0].text = path[0].text.match(/\d[^(\n]+/g)[0].replace(/[\d. ]/g, '');
      }
    };
    for (var fieldUom in dataRef[0].group[0]) {
      if (fieldUom.includes('PerServingUom')) {
        nutritionalInfoUnitFormatter(dataRef[0].group[0][fieldUom]);
      }
    }
  },
};
