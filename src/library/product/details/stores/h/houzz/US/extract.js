const { transform } = require('../../../../shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    const element = document.evaluate("//button[contains(@class,'hz-modal__header-close')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // @ts-ignore
    element && element.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
  // @ts-ignore
  async function preparePage (variantLength, index) {
    await context.evaluate(async (variantLength) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function findXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const productDetails = element && element.textContent ? element.textContent : '';
        return productDetails;
      }
      function clickXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        element && element.click();
      }
      addHiddenDiv('ii_variantCount', variantLength);
      await clickXpath("//button[contains(@class,'hz-modal__header-close')]");
      await new Promise(resolve => setTimeout(resolve, 1000));
      // description
      const descContent = (document.querySelector("div[class*='vp-redesign-description']")) ? document.querySelector("div[class*='vp-redesign-description']").innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim() : '';
      addHiddenDiv('ii_desc', descContent);
      const additionalBullets = document.querySelectorAll("div[class*='vp-redesign-description'] li") ? document.querySelectorAll("div[class*='vp-redesign-description'] li") : [];
      const arrayBullets = [];
      additionalBullets.forEach(item => {
        arrayBullets.push(item.innerText);
      });
      addHiddenDiv('ii_bulletCount', additionalBullets.length);
      addHiddenDiv('ii_bullets', arrayBullets.join(' || '));
      // specifications
      clickXpath("//li[contains(@class,'hzui-tabs__label') and contains(.,'Product Specifications')]");
      const seller = findXpath("//div[contains(@class,'product-spec-item') and contains(.,'Sold By')]//dd");
      const lbb = seller.toLowerCase().includes('houzz') ? 'No' : 'Yes';
      if (lbb === 'Yes') {
        clickXpath("//li[contains(@class,'hzui-tabs__label') and contains(.,'Shipping and Returns')]");
        addHiddenDiv('ii_otherSellerName', seller);
        const price = findXpath("//span[contains(@class,'pricing-info__price')]");
        addHiddenDiv('ii_price', price);
        let shippingPrice = findXpath("//span[contains(@class,'product-main-seller__shipping')]");
        shippingPrice = shippingPrice.replace(/.*(\$\d+).*/, '$1');
        addHiddenDiv('ii_shippingPrice', shippingPrice);
        addHiddenDiv('ii_lbb', lbb);
      }
      clickXpath("//li[contains(@class,'hzui-tabs__label') and contains(.,'Product Specifications')]");
      // @ts-ignore
      const dataJson = document.querySelector("script[type*='application/ld+json']") ? JSON.parse(document.querySelector("script[type*='application/ld+json']").innerText) : [];
      if (dataJson[0]) {
        const weight = dataJson[0].weight && dataJson[0].weight.description ? dataJson[0].weight.description : '';
        const productID = dataJson[0].productID ? dataJson[0].productID : '';
        const mpn = dataJson[0].mpn ? dataJson[0].mpn : '';
        const ratingCount = dataJson[0].aggregateRating && dataJson[0].aggregateRating.ratingValue ? dataJson[0].aggregateRating.ratingValue : '';
        const aggregateRatingText = dataJson[0].aggregateRating && dataJson[0].aggregateRating.ratingCount ? dataJson[0].aggregateRating.ratingCount : '';
        addHiddenDiv('ii_weight', weight);
        addHiddenDiv('ii_mpn', mpn);
        addHiddenDiv('ii_ratingCount', ratingCount);
        addHiddenDiv('ii_aggregateRatingText', aggregateRatingText);
        addHiddenDiv('ii_productID', productID);
      };
    }, variantLength);
  }
  const variantLength = await context.evaluate(() => {
    // @ts-ignore
    document.querySelector("div[data-compid*='variationThemesListItem']") && document.querySelector("div[data-compid*='variationThemesListItem']").click();
    const count = document.querySelectorAll("div[class*='product-variations-theme-options'] ul li") ? document.querySelectorAll("div[class*='product-variations-theme-options'] ul li").length : 0;
    // @ts-ignore
    document.querySelector("div[data-compid*='variationThemesListItem']") && document.querySelector("div[data-compid*='variationThemesListItem']").click();
    return count;
  });
  console.log('Number of variants::', variantLength);
  // eslint-disable-next-line no-unmodified-loop-condition
  for (let index = 1; index <= variantLength && variantLength > 1; index++) {
    console.log('Inside loop', index);
    await context.evaluate(async (index) => {
      if (index > 1) {
        // @ts-ignore
        document.querySelector("div[data-compid*='variationThemesListItem']") && await document.querySelector("div[data-compid*='variationThemesListItem']").click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // @ts-ignore
        document.querySelector(`div[class*='product-variations-theme-options'] ul li:nth-child(${index})`) && document.querySelector(`div[class*='product-variations-theme-options'] ul li:nth-child(${index})`).click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      // return count;
    }, index);
    // await context.click("div[data-compid*='variationThemesListItem']");
    // await new Promise(resolve => setTimeout(resolve, 100));
    // await context.clickAndWaitForNavigation(`div[class*='product-variations-theme-options'] ul li:nth-child(${index})`, {}, { timeout: 20000 });
    // await context.click(`div[class*='product-variations-theme-options'] ul li:nth-child(${index})`);
    // }
    if (index < variantLength) {
      console.log('Inside variants', index);
      await preparePage(variantLength, index);
      await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
  }
  await preparePage(variantLength);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'houzz',
    transform,
    domain: 'houzz.com',
    zipcode: '',
  },
  implementation,
};
