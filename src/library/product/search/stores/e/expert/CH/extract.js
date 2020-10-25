const { transform } = require('./transform');
// const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  // await context.evaluate(async (context) => {
  //   let count = 0;
  //   while (count < 150 && document.evaluate("//*[contains(@id,'pageContent')]//button[contains(@class,'styled__StyledButton') and contains(.,'Mehr anzeigen') and not(./@disabled)]", document).iterateNext()) {
  //     const loadMore = document.evaluate("//*[contains(@id,'pageContent')]//button[contains(@class,'styled__StyledButton') and contains(.,'Mehr anzeigen') and not(./@disabled)]", document).iterateNext();
  //     await loadMore.click();
  //     await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  //     await context.extract(productDetails, { transform });
  //     count = document.querySelectorAll("div[class*='productList'] article[class*='panelProduct'] article, main[id*='pageContent'] div[class*='productList'] article").length;
  //   }
  // }, context);
  // async function aggregateRating () {
  //   function addHiddenField (id, content, index) {
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     const originalDiv = document.querySelectorAll("div[class*='productList'] article[class*='panelProduct']")[index];
  //     originalDiv.appendChild(newDiv);
  //   }
  //   const element = document.querySelectorAll("div[class*='productList'] article[class*='panelProduct'] svg rect[fill*='black']");
  //   let count = 1;
  //   while (element.length + 1 > count) {
  //     addHiddenField('ii_rating', element.width, count);
  //     count++;
  //   }
  // }
  // await context.evaluate(infiniteScroll);
  // await context.evaluate(aggregateRating);
  await context.evaluate(addUrl);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    transform,
    domain: 'digitec.ch',
    zipcode: '',
  },
  implementation,
};
