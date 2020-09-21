const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    transform: null,
    domain: 'expertonline.it',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }catch(error){
      console.log(error)
    }
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function findJsonObj (scriptSelector) {
      try {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
    let str = '"@type":"Product"';
    let JSONArr = findJsonObj(str);
    console.log(JSONArr , 'JSONArr');

      let offer_text = JSONArr ? JSONArr.offers : '';
      let availability_text = offer_text ? offer_text.availability : ''
      if(availability_text.includes('OutOfStock'))  {
        availability_text = "Out of Stock"
      } else {
        availability_text = "In Stock"
      }
      addHiddenDiv('availability', availability_text);
      let gtin = JSONArr ? JSONArr.gtin13 : ''
      addHiddenDiv('gtin', gtin);
      let Sku = JSONArr ? JSONArr.sku : ''
      addHiddenDiv('Sku', Sku);
      let sellerText = offer_text ? offer_text.seller : ''
      let seller = sellerText ? sellerText.name : ''
      addHiddenDiv('sellerName', seller);
      let RatingText = JSONArr ? JSONArr.aggregateRating : '';
      let reviewCount = RatingText? RatingText.reviewCount : ''
      addHiddenDiv('reviewCount', reviewCount);
      let aggregateRating = RatingText? RatingText.ratingValue : ''
      addHiddenDiv('aggregateRating', aggregateRating);
      let finalSpecification;
      let specElement;
      let specification = document.querySelector("table#SchedaTecnicaHTML tbody");
      console.log(specification.innerHTML , "specification");
      specElement = specification ? specification.innerHTML.replace(/<tr><td colspan="2" bgcolor="#f8f8f8">.*?>/gm, ' ').replace(/<\/td><td class="tdDestro">/gm , ':').replace(/<\/td><\/tr><tr><td class="tdSinistro">/gm , '||').replace(/<\/td><\/tr> <\/tr><tr><td class="tdSinistro">/gm , '||').replace(/<\/tr><tr><td class="tdSinistro">/gm , ' ').replace(/<\/td><\/tr>/gm , ' ').trim() : '';
      finalSpecification = specElement
      console.log('finalDescription1: ', finalSpecification);
      addHiddenDiv('bb_specification',finalSpecification);
  })

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
