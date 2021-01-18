const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  console.log('Do pagination');
  const resultCounter = 0;
  await new Promise(r => setTimeout(r, 8000));

  async function getNumberResultsOnPage () {
    return await context.evaluate(function () {
      const resultXPath = "//div[@class='css-1dbjc4n']//div[contains(@class,'r-1pi2tsx')]//a"; // list of items on the page from Shaun
      const query = document.evaluate(resultXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const numberPageResults = query.snapshotLength;
      console.log(numberPageResults + 'results on page');
      return numberPageResults;
    });
  }

  async function buttonCheck () {
    return await context.evaluate(function () {
      const button = document.querySelector('div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7');
      if (button != null) {
        return true;
      } else {
        return false;
      }
    });
  }

  async function continuedClickToShowResults () {
    const moreButton = 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7';
    let numberPageResults = 0;
    let count = 0;
    while (numberPageResults <= 40 && count < 200) {
      if (await buttonCheck()) {
        context.click(moreButton);
        numberPageResults = await getNumberResultsOnPage();
        console.log(numberPageResults + ' items on page');
        await new Promise(r => setTimeout(r, 10000));
        count++;
      } else {
        break;
      }
    }
  }

  await continuedClickToShowResults();

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation,
};
