async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  // const { transform } = parameters;

  async function getMaxClicks() {
    return await context.evaluate(() => {
      const totalResults = document.evaluate('//h1[@class="showing___20A1_"]/text()[2]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.trim();
      const resultPerLoad = document.querySelectorAll('article.productPod___1NmFb').length;
      console.log(`#####totalResults FOund ${totalResults}`);
      console.log(`#####resultPerLoad FOund ${resultPerLoad}`);
      if (Number(totalResults) > Number(resultPerLoad)) {
        const roundoff = Math.round(Number(totalResults) / Number(resultPerLoad)) - 1;
        console.log(`roundoff ---- ${roundoff}`);
        return roundoff
      }
    });
  }

  async function getButton() {
    return await context.evaluate(() => {
      console.log('#####Is Avaiablle FOund');
      const buttonInfo = document.querySelector('div.loadMoreWrapper___UneG1 > button')
      console.log(`buttonInfo ---- ${buttonInfo}`);
      return buttonInfo
    });
  }

  let maxClicks = await getMaxClicks();
  const button = await getButton();

  console.log(`&&&&&&&&& maxClicks ${maxClicks}`);
  console.log(`&&&&&&&&& button ${button}`);

  while (maxClicks > 0) {
    console.log('Clicked');
    if (button) {
      console.log(`#####button FOund ${button}`);
      button.click();
      console.log(`#####button Clicked ${button}`);
      // @TODO - Add a check for load more selector also i.e click only exists
      await timeout(60000);
      maxClicks--;
    }
  }


  async function timeout(ms) {
    console.log('#### Waitng ###########');
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: null,
    domain: 'waitrose.com',
  },
  implementation,
};
