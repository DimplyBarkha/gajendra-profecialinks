const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    transform: cleanUp,
    domain: 'boozt.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      function addElementToDocument(id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const availability = document.querySelector("meta[property='og:availability']") ? document.querySelector("meta[property='og:availability']").getAttribute('content') : '';
      addElementToDocument('availability', availability === 'instock' ? 'In Stock' : 'Out Of Stock');

      // getting nameExtended
      const brand = document.querySelector('a[data-track-id=pdp_brandname]') ? document.querySelector('a[data-track-id=pdp_brandname]').innerText : null;
      const name = document.querySelector('h1.pp-info__name') ? document.querySelector('h1.pp-info__name').innerText : null;
      const script = document.querySelector('script[data-js-react-on-rails-store="store"]') ? document.querySelector('script[data-js-react-on-rails-store="store"]').innerText : null;
      const scriptToString = JSON.parse(script);
      const size = scriptToString.product.current.size_detail;
      const color = scriptToString.product.current.colourDetail;

      //getting firstVariant
      const variantSize = document.querySelector('div.pp-size-selector__label') ? document.querySelector('div.pp-size-selector__label') : null;
      const variantColor = document.querySelector('p.pp-colour-selector__label') ? document.querySelector('p.pp-colour-selector__label span').innerText : null;
      if (variantSize !== null) {
        addElementToDocument('variant-information', 'Size');
        addElementToDocument('first-var', size);
      } else if (variantColor !== null) {
        addElementToDocument('variant-information', 'Color');
        addElementToDocument('first-var', color);
      }

      //setting nameExtended
      if (variantColor && !variantSize) {
        addElementToDocument('nameext', brand + ' ' + name + ' ' + variantColor)
      } else if (variantSize && !variantColor) {
        addElementToDocument('nameext', brand + ' ' + name + ' ' + size)
      } else if (!variantColor && !variantSize) {
        addElementToDocument('nameext', brand + ' ' + name + ' ' + color)
      }
    });
    await context.extract(productDetails);

    const allInfo = await context.evaluate(async function () {
      // taking all buttons with information about the product
      const infoBtns = document.querySelectorAll('div.pp-tabs__list button');

      var allInfoRaw = {
        prodInfo: '',
        careTips: '',
        shippingInfo: '',
        ingredients: '',
      };

      // iteration through all the buttons and click on them for loading the div with text
      for (let i = 0; i < infoBtns.length; i++) {
        if (infoBtns[i].innerText === 'BÆREDYGTIG FASHION' || infoBtns[i].innerText === 'TØJPLEJE' || infoBtns[i].innerText === 'CARE TIPS') {
          infoBtns[i].click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          const careTips = document.querySelector('div.pp-tabs__content.pp-content').innerText;
          allInfoRaw.careTips = careTips;
        }
        if (infoBtns[i].innerText === 'INGREDIENSER') {
          infoBtns[i].click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          const ingredients = document.querySelector('div.pp-tabs__content.pp-content div.pp-content__text').innerText;
          allInfoRaw.ingredients = ingredients;
        }
      }
      return allInfoRaw;
    });

    var dataRef = await context.data();

    if (!('productOtherInformation' in dataRef[0].data[0].group[0])) {
      dataRef[0].data[0].group[0].productOtherInformation = [{ text: allInfo.careTips }];
    } else if ('text' in dataRef[0].data[0].group[0].productOtherInformation[0]) {
      dataRef[0].data[0].group[0].productOtherInformation[0].text = allInfo.careTips;
    } else {
      dataRef[0].data[0].group[0].productOtherInformation[0].push({ text: allInfo.careTips });
    }
    if (!('ingredientsList' in dataRef[0].data[0].group[0])) {
      dataRef[0].data[0].group[0].ingredientsList = [{ text: allInfo.ingredients }];
    } else if ('text' in dataRef[0].data[0].group[0].ingredientsList[0]) {
      dataRef[0].data[0].group[0].ingredientsList[0].text = allInfo.ingredients;
    } else {
      dataRef[0].data[0].group[0].ingredientsList[0].push({ text: allInfo.ingredients });
    }
  },
};
