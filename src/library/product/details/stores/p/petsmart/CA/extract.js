
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    transform: null,
    domain: 'petsmart.ca',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
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

      // getting data from ingredients tab
      const ingredientsTab = document.querySelector('li#react-tabs-2');
      if (ingredientsTab) {
      // @ts-ignore
        ingredientsTab.click();
        const ingredients = document.querySelector(
          'div.react-tabs__tab-content > p:first-of-type',
        )
          ? document
            .querySelector('div.react-tabs__tab-content > p:first-of-type')
          // @ts-ignore
            .innerText.trim()
          : '';
        ingredientsTab.setAttribute('ingredients', ingredients);

        const nutritionalInfo = document.querySelector(
          'div.react-tabs__tab-content > p:nth-of-type(2)',
        )
          ? document
            .querySelector('div.react-tabs__tab-content > p:nth-of-type(2)')
          // @ts-ignore
            .innerText.trim()
          : '';
        ingredientsTab.setAttribute('nutritional', nutritionalInfo);

        const servingSize = document.querySelector(
          'div.react-tabs__tab-content > p:nth-of-type(3)',
        )
          ? document
            .querySelector('div.react-tabs__tab-content > p:nth-of-type(3)')
          // @ts-ignore
            .innerText.trim()
          : '';
        ingredientsTab.setAttribute('servingsize', servingSize);
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
    });

    var dataRef = await context.extract(productDetails);

    var description = dataRef[0].group[0].description;
    if (description && description.length > 1) {
      let fullDescription = '';
      description.forEach((desc) => {
        fullDescription += desc.text + ' ';
      });
      description[0].text = fullDescription;
      description.splice(1);
    }

    var servingSizeUom = dataRef[0].group[0].servingSizeUom;
    if (servingSizeUom) {
      servingSizeUom[0].text = servingSizeUom[0].text.replace(/\d/g, '').replace(/\//g, '');
    }

    const nutritionalInfoFormatter = (path) => {
      if (path) {
        path[0].text = path[0].text.replace(/[^\d.]/g, '');
        if (path[0].text.indexOf('.') === 0) {
          path[0].text = path[0].text.slice(1);
        }
      }
    };
    for (var field in dataRef[0].group[0]) {
      if (field.includes('PerServing') && !field.includes('calories') && !field.includes('Uom')) {
        nutritionalInfoFormatter(dataRef[0].group[0][field]);
      }
    }
    const nutritionalInfoUnitFormatter = (path) => {
      if (path) {
        path[0].text = path[0].text.replace(/.+[\d ]/, '');
      }
    };
    for (var fieldUom in dataRef[0].group[0]) {
      if (fieldUom.includes('PerServingUom')) {
        nutritionalInfoUnitFormatter(dataRef[0].group[0][fieldUom]);
      }
    }
  },
};
