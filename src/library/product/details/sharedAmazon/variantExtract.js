module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;

  async function pageData () {
    return await context.evaluate(async () => {
      const pageContext = {};
      // get variants
      pageContext.variants = window.isTwisterPage ? [...new Set(Object.keys(window.twisterController.initTwisterState.twisterVariationsData.dimensionValuesDisplay))] : null;
      // get parentAsin
      pageContext.parentAsin = window.isTwisterPage ? window.twisterController.twisterJSInitData.parent_asin : null;
      // get currentAsin
      pageContext.currentAsin = window.isTwisterPage ? window.twisterController.twisterJSInitData.current_asin : window.ue_pti;
      // get largeImageCount
      pageContext.largeImageCount = document.evaluate('//script[contains(text(), "ImageBlockATF")]/text()', document.body, null, XPathResult.ANY_TYPE, null).iterateNext() ? document.evaluate('//script[contains(text(), "ImageBlockATF")]/text()', document.body, null, XPathResult.ANY_TYPE, null).iterateNext().toString().split('SL1500').length : 0;
      // check for additionalRatings
      pageContext.additionalRatings = !!document.querySelector('table#histogramTable');

      return pageContext;
    });
  }

  const pageContext = await pageData();

  let allVariants = pageContext.variants || [];
  allVariants.push(pageContext.currentAsin);
  allVariants = Array.from(new Set(allVariants));
  await context.evaluate((allVariants) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    allVariants.forEach(variant => {
      addHiddenDiv('ii_variant', variant);
    });
  }, allVariants);

  return await context.extract(variants);
};
