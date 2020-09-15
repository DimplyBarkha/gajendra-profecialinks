const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    transform,
    domain: 'liverpool.com.mx',
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
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul.m-product__listingPlp li div.m-plp-card-container')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
    let str = '"@type":"ItemList"';
    let JSONArr = findJsonObj(str);
    JSONArr = JSONArr ? JSONArr.itemListElement : [];
    for (let index = 0; index < JSONArr.length; index++) {
      const element = JSONArr[index].item;
      let rating = element ? element.aggregateRating : '';
      rating = rating ? rating.ratingValue : '';
      addHiddenDiv('li_rating', rating , index);
      let review = element ? element.aggregateRating : '';
      review = review ? review.reviewCount : '';
      addHiddenDiv('li_review', review , index);
      let url = element ? element.url : '';
      addHiddenDiv('li_url', url , index);
      let name = element ? element.name : '';
      addHiddenDiv('li_name', name , index);
      let id = url ? url : '';
      addHiddenDiv('li_id', id , index);
    }
    console.log('JSON: ', JSON);
  })

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
