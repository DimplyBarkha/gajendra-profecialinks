const { transform } = require('./format');
async function implementation(
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    var element = document.querySelectorAll("div[cel_widget_id*='aplus'] img");
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 20);
        });
      });
    }
    // if (document.querySelectorAll("div[id*='mbc'] span[id*='mbc-shipping']")) {
    //   const otherShippingPrice = document.querySelectorAll("div[id*='mbc'] span[id*='mbc-shipping']");
    //   otherShippingPrice.forEach((node) => {
    //     // @ts-ignore
    //     if (node.innerText) {
    //       // @ts-ignore
    //       const val = node.innertext.replace(/.*(.[\d]+(?:.[\d]+)?).*/, '$1');
    //       addHiddenDiv('ii_otherSellersShipping', val);
    //     }
    //   });
    // }
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
  },
  implementation,
};
