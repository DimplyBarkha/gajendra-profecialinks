const { transform } = require('./shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // try{

  // }catch(e => {

  // })
  // await context.waitForSelector('div.uc-btn-accept-wrapper>button.uc-btn-accept');
  // await context.click('div.uc-btn-accept-wrapper>button.uc-btn-accept')

  await context.evaluate(async function () {
    const cookieSelector = Boolean(document.querySelector('div.uc-btn-accept-wrapper>button.uc-btn-accept'));
    if(cookieSelector){
      document.querySelector('div.uc-btn-accept-wrapper>button.uc-btn-accept').click();
    }
    document.querySelectorAll('div.rd__rating__result').forEach(rating => {
      const width = Number(rating.getAttribute('style').match(/\d+/)[0]);
      rating.parentElement.parentElement.innerText = (width / 20).toString();
    });
  });

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform,
    domain: 'douglas.de',
  },
  implementation,
};
