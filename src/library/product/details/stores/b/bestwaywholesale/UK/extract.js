const { transform } = require('../shared');

async function implementation (inputs,
  parameters,
  context,
  dependencies) {
  const clickPopup = async function (context) {
    const allowCookies = await context.evaluate((selector) => !!document.querySelector(selector), 'a.cc-primary-btn');

    if (allowCookies) {
      await context.click('a.cc-primary-btn');
    }

    const deliveryType = await context.evaluate((selector) => !!document.querySelector(selector), '#fulf-select-D');

    if (deliveryType) {
      await context.click('#fulf-select-D');
      await context.waitForNavigation();
    }
  };

  await clickPopup(context);

  await context.evaluate(async function () {
    const doesProductAvailable = getEleByXpath('//div[contains(@class,"productpagedetail")]');
    if (!doesProductAvailable) {
      return;
    }
    // Getting the available details from script
    const productData = findProductDetails();
    addEleToDoc('productId', productData.id);
    addEleToDoc('productName', productData.name);
    addEleToDoc('productPrice', productData.price);

    // Normalizing & Adding nutritional info to DOM as there are lot of escape formats involved
    addNutritionalEle('saltPerServing', '/html/body//table//th[contains(text(), \'Salt\')]/following-sibling::td[1]', 'saltPerServingUom');
    addNutritionalEle('servingSize', '//h2[contains(.,"Nutritional Information")]/following-sibling::table//tr[1]/th[2]', 'servingSizeUom');

    const multiNutriObj = {
      totalFatPerServing: 'Fat',
      saturatedFatPerServing: 'Saturates',
      totalCarbPerServing: 'Carbohydrate',
      dietaryFibrePerServing: 'Fibre',
      totalSugarsPerServing: 'Sugars',
      proteinPerServing: 'Protein',
      calciumPerServing: 'Calcium',
      vitaminCPerServing: 'Vitamin C',
    };

    addMultipleNutritionalEle(multiNutriObj);

    const servingSuggestHeader = getEleByXpath('//th[contains(.,\'Serving Suggestion\')]');
    const servingSuggest = getEleByXpath('//th[contains(.,\'Serving Suggestion\')]/following-sibling::td');
    if (servingSuggestHeader) {
      addEleToDoc('servingSuggest', `${servingSuggestHeader} : ${servingSuggest}`);
    }

    function getEleByXpath (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      console.log('Element' + element);
      const text = element ? element.textContent : null;
      return text;
    }

    function addNutritionalEle (property, xpath, propertyUom) {
      const servingProp = getEleByXpath(xpath);
      if (servingProp) {
        const normlizedServingProp = servingProp.replace('mg', '').replace('g', '').replace('ml', '').replace('Per', '').replace(':', '').split('(')[0].trim();
        if (!normlizedServingProp.match(/(^[.0-9<>%a-zA-Z]+)/g)) {
          return;
        }
        addEleToDoc(property, normlizedServingProp);
        if (servingProp.includes('mg')) {
          addEleToDoc(propertyUom, 'mg');
        } else if (servingProp.includes('g')) {
          addEleToDoc(propertyUom, 'g');
        } else if (servingProp.includes('ml')) {
          addEleToDoc(propertyUom, 'ml');
        } else if (servingProp.includes('%')) {
          addEleToDoc(propertyUom, '%');
        }
      }
    }

    function addMultipleNutritionalEle (propertiesObj) {
      for (const prop in propertiesObj) {
        const xpath = `//th[contains(.,'${propertiesObj[prop]}') or contains(.,'${propertiesObj[prop].toLowerCase()}')]/following-sibling::td[1]`;
        addNutritionalEle(`${prop}`, xpath, `${prop}Uom`);
      }
    }

    function findProductDetails () {
      const xpath = '//script[contains(.,\'productDetails\')]';
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      console.log('Element' + element);
      const scriptContent = element.textContent;
      let scriptContentArr = scriptContent.split(';');
      scriptContentArr = scriptContentArr.filter(function (item) { if (item.includes('productsObject.')) return item; });
      const productDetails = {};
      for (let i = 0; i < scriptContentArr.length; i++) {
        const chunk = scriptContentArr[i];
        const productProp = chunk.substring(chunk.indexOf('productsObject.') + 'productsObject.'.length, chunk.indexOf(' ='));
        const productPropVal = chunk.substring(chunk.indexOf(`productsObject.${productProp} = "`) + `productsObject.${productProp} = "`.length, chunk.lastIndexOf('"'));
        productDetails[productProp] = productPropVal;
      }
      return productDetails;
    }

    function addEleToDoc (key, value) {
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      document.body.appendChild(prodEle);
    }
  });

  try {
    // @hack - Sometimes additional info is not loaded on the DOM
    await context.click('#tabnav > li:nth-child(5) > a');
    await context.waitForSelector('#content2');
    await context.click('#tabnav > li:nth-child(1) > a');
  } catch (err) {
    console.log('Manufacturing info is not loaded');
  }

  const { productDetails } = dependencies;
  const { transform } = parameters;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    transform,
    domain: 'bestwaywholesale.co.uk',
    zipcode: '',
  },
  implementation,
};
