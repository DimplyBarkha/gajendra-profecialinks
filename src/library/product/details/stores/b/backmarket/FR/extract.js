const { transform }  = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    transform,
    domain: 'backmarket.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
   
    await context.evaluate(async function () {
      function findJsonData (scriptSelector, startString, endString) { 
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const scriptContent = element ? element.textContent : '';
        return scriptContent;
    }
    let JSONStr = findJsonData('"availability": "','{"@context":','}');
    console.log('JSONStr: ', JSONStr);
    // console.log('JSON: ', JSON);
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      }
      // addHiddenDiv('bb_availability', availability);
      // @ts-ignorelea
      // let aggregateRatingObj = JSON.parse(JSONStr);
      let JSONObj = JSON.parse(JSONStr);
      let aggregateRatingObj = JSON.parse(JSONStr);
      // @ts-ignore
      aggregateRatingObj = aggregateRatingObj ? aggregateRatingObj.aggregateRating : '';
      // @ts-ignore
      let rating = aggregateRatingObj ? aggregateRatingObj.ratingValue : '';
      addHiddenDiv('bb_rating', rating);
      let reviewCount = aggregateRatingObj ? aggregateRatingObj.reviewCount : '';
      addHiddenDiv('bb_reviewCount', reviewCount);
      let image = JSONObj ? JSONObj.image : '';
      addHiddenDiv('bb_image', image);
      let description = JSONObj ? JSONObj.description : '';
      addHiddenDiv('bb_description', description);
      let brand = JSONObj ? JSONObj.brand : '';
      brand = brand ? brand.name : '';
      addHiddenDiv('bb_brand', brand);
    });
    
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
