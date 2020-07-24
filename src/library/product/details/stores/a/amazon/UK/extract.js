const { transform } = require('./format');
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
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    var element = document.querySelectorAll("div[cel_widget_id*='aplus'] img");
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    }
    var CurrentSeller = document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
    var CurrentSellerPrice = document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
    var CurrentSellerShipping = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
    if (CurrentSeller && CurrentSeller.search('sold by amazon') < 0 && CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)) {
      CurrentSeller = (CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1]) ? CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1] : CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[2];
      if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
      addHiddenDiv('ii_otherSellersName', CurrentSeller);
      addHiddenDiv('ii_otherSellersPrice', CurrentSellerPrice);
      addHiddenDiv('ii_otherSellersShipping', CurrentSellerShipping);
      console.log('CurrentSeller', CurrentSeller);
      console.log('CurrentSellerPrice', CurrentSellerPrice);
      console.log('CurrentSellerShipping', CurrentSellerShipping);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
    zipcode: 'SW1P 3EU',
  },
  implementation,
};
