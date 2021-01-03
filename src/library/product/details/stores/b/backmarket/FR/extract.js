const { transform } = require('../shared');
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
      const notLoaded = document.evaluate('//h3[contains(text(), "pas été trouvée. ")] | //h3[contains(text(), "- Ce lien n’a pas encore été reconditionné")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (notLoaded) {
        return;
      }
      function findJsonData (scriptSelector, startString, endString) {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const scriptContent = element ? element.textContent : '';
        return scriptContent;
      }
      const JSONStr = findJsonData('"availability": "', '{"@context":', '}');
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
      const JSONObj = JSONStr ? JSON.parse(JSONStr) : '';
      let aggregateRatingObj = JSONStr ? JSON.parse(JSONStr) : '';
      // @ts-ignore
      aggregateRatingObj = aggregateRatingObj ? aggregateRatingObj.aggregateRating : '';
      // @ts-ignore
      const rating = aggregateRatingObj ? aggregateRatingObj.ratingValue : '';
      addHiddenDiv('bb_rating', rating);
      const reviewCount = aggregateRatingObj ? aggregateRatingObj.reviewCount : '';
      addHiddenDiv('bb_reviewCount', reviewCount);
      let brand = JSONObj ? JSONObj.brand : '';
      brand = brand ? brand.name : '';
      addHiddenDiv('bb_brand', brand);
      let description;
      const descriptiontag1 = document.querySelectorAll('div[class="main-container"] div[slot="content"]');
      const descriptiontag2 = document.querySelectorAll('div[id="main_container"]');
      if (descriptiontag1 && (descriptiontag1.length > 0)) {
        description = descriptiontag1;
      } else if (descriptiontag2 && (descriptiontag2.length > 0)) {
        description = descriptiontag2;
      }
      console.log('hjkk', description);
      let div;
      let divFinal = 0;
      for (let index = 0; index < description.length; index++) {
        const element = description[index];
        // @ts-ignore
        const element1 = description[index].innerText;
        if (element1.length > divFinal) {
          div = element;
          divFinal = element1.length;
        }
      }
      console.log('DIVVVV', div);
      // @ts-ignore
      const description2 = div ? div.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      console.log('description2: ', description2);
      let finalDescription;
      if (description2.includes('CARACTÉRISTIQUES TECHNIQUES')) {
        finalDescription = description2 ? description2.split('CARACTÉRISTIQUES TECHNIQUES')[0] : '';
      } else if (description2.includes('CARACTÉRISTIQUES')) {
        finalDescription = description2 ? description2.split('CARACTÉRISTIQUES')[0] : '';
      } else if (description2.includes('CARACTERISTIQUES')) {
        finalDescription = description2 ? description2.split('CARACTERISTIQUES')[0] : '';
      } else {
        finalDescription = description2 || '';
      }
      // @ts-ignore
      addHiddenDiv('cc_description', finalDescription);
      let specification;
      if (description2.includes('CARACTERISTIQUES')) {
        specification = description2 ? description2.split('CARACTERISTIQUES')[1] : '';
      } else if (description2.includes('CARACTÉRISTIQUES')) {
        specification = description2 ? description2.split('CARACTÉRISTIQUES')[1] : '';
      } else if (description2.includes('CARACTÉRISTIQUES TECHNIQUES')) {
        specification = description2 ? description2.split('CARACTÉRISTIQUES TECHNIQUES')[1] : '';
      }
      // @ts-ignore
      addHiddenDiv('cc_specification', specification);
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
