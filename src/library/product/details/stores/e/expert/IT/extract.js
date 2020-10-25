const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    transform,
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
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.log(error);
    }
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await context.waitForSelector('script#productMicroData');
    } catch (error) {
      console.log(error);
    }

    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function findJsonObj1 (scriptSelector) {
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

    function findJsonObj2 () {
      try {
        const xpath = '//script[contains(id,\'productMicroData\')]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
    const str = '"@type":"Product"';
    let JSONArr;
    const JSONArr1 = findJsonObj1(str);
    const JSONArr2 = findJsonObj2();
    console.log(JSONArr, 'JSONArr');
    if (JSONArr1) {
      JSONArr = JSONArr1;
    } else if (JSONArr2) {
      JSONArr = JSONArr2;
    } else if (JSONArr1 && JSONArr2) {
      if (JSONArr1.length >= JSONArr2.length) {
        JSONArr = JSONArr1;
      } else if (JSONArr2.length >= JSONArr1.length) {
        JSONArr = JSONArr2;
      }
    }
    const offerText = JSONArr ? JSONArr.offers : '';
    let availabilityText = offerText ? offerText.availability : '';
    if (availabilityText.includes('OutOfStock')) {
      availabilityText = 'Out of Stock';
    } else {
      availabilityText = 'In Stock';
    }
    addHiddenDiv('availability', availabilityText);
    const gtin = JSONArr ? JSONArr.gtin13 : '';
    addHiddenDiv('gtin', gtin);
    const Sku = JSONArr ? JSONArr.sku : '';
    addHiddenDiv('Sku', Sku);
    // let sellerText = offer_text ? offer_text.seller : ''
    // let seller = sellerText ? sellerText.name : ''
    // addHiddenDiv('sellerName', seller);
    const RatingText = JSONArr ? JSONArr.aggregateRating : '';
    const reviewCount = RatingText ? RatingText.reviewCount : '';
    addHiddenDiv('reviewCount', reviewCount);
    let aggregateRating = RatingText ? RatingText.ratingValue : '';
    aggregateRating = aggregateRating ? Number(aggregateRating).toFixed(1) : '';
    console.log('aggregateRating: ', aggregateRating);
    addHiddenDiv('aggregateRating', aggregateRating.replace('.', ','));
    // let enhancedContent = document.querySelector('div#flix-inpage').innerHTML;
    // enhancedContent = enhancedContent ? enhancedContent.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    // addHiddenDiv('li_enhancedContent', enhancedContent);
    const specTrs = document.querySelectorAll('#Dettaglio table tr');
    const finalSpecArr = [];
    let field;
    let value;
    for (let index = 0; index < specTrs.length; index++) {
      const element = specTrs[index];
      field = element.querySelector('td.tdSinistro');
      // @ts-ignore
      const fieldStr = field ? field.innerText : '';
      value = element.querySelector('td.tdDestro');
      // @ts-ignore
      const valueStr = value ? value.innerText : '';
      if (fieldStr && valueStr) {
        const fieldVal = fieldStr + ' : ' + valueStr;
        finalSpecArr.push(fieldVal);
      }
    }
    let finalSpecStr;
    if (finalSpecArr.length > 0) {
      finalSpecStr = finalSpecArr.join(' || ');
    }
    addHiddenDiv('ex_specification', finalSpecStr);
    const brand = JSONArr ? JSONArr.brand : '';
    console.log('brand: ', brand);
    const brandText = brand ? brand.name : '';
    console.log('brandText: ', brandText);
    addHiddenDiv('ex_brand', brandText);
    const descArr = [];
    let finalDes;
    const descriptionLi = document.querySelectorAll('div[class="skywalker_scheda_descrizione"] ul li');
    for (let index = 0; index < descriptionLi.length; index++) {
      const li = descriptionLi[index];
      // @ts-ignore
      const descTxt = li.innerText;
      descArr.push(descTxt);
    }
    if (descArr.length > 0) {
      finalDes = descArr.join(' || ');
      finalDes = '|| ' + finalDes;
    }
    addHiddenDiv('ex_description', finalDes);
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
