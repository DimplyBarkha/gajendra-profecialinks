const { transform } = require('./format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variantArray = await context.evaluate(async function () {
    if (document.querySelector('#productList')) {
      throw new Error('Not a product page');
    }
    if (document.querySelectorAll('div.clearfix.custom-dropdown-content button')) {
      const variantArray = document.querySelectorAll('div.clearfix.custom-dropdown-content button');
      return variantArray;
    }
  });
  if (variantArray) {
    for (let i = 0; i < variantArray.length; i++) {
      variantArray[i].click();
      await context.waitForSelector('div.pdp-filter-thumbnail');
      await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
  }

  try {
    await context.click('button[id*=productDescriptionShowMore]');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.click('div.flixmedia_expandBtn.flixmedia_expandBtn--more');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  } catch (e) {
    console.log("some error occurred while clicking show more button")
  }

  await context.evaluate(async function () {
    let specificationsXpath = `//div[@id='mainProductDescription']//b[contains(text(),'Spécifications') or contains(text(),"Caractéristiques") or contains(text(),'Informations produit')]/following-sibling::text()|//h2[contains(text(),'Caractéristiques détaillées')]/following-sibling::node()|text()|//div[@id='mainProductDescription']//text()[contains(.,"Dimensions")]//following-sibling::text()[not(//div[@id='mainProductDescription']//b[contains(text(),'Spécifications') or contains(text(),"Caractéristiques") or contains(text(),'Informations produit')]/following-sibling::text()|//h2[contains(text(),'Caractéristiques détaillées')]/following-sibling::node()|text())] | //tr[contains(.,"Dimensions")]/following-sibling::tr[following::tr[contains(.,"Contenu du carton")]] | //tr[contains(.,"Dimensions")]`;
    function _x(STR_XPATH, context) { //gets nodes using xpath
      var xresult = document.evaluate(
        STR_XPATH,
        context,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      var xnodes = [];
      var xres;
      while ((xres = xresult.iterateNext())) {
        xnodes.push(xres);
      }
      return xnodes;
    }
    let specificationsText = [];
    _x(specificationsXpath, document).forEach(q => {specificationsText.push(q.textContent)});
    document.body.insertAdjacentHTML("afterbegin", `<div id="specifications" style="display : none">${specificationsText.join(" ")}</div>`)
  })

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    transform,
    domain: 'laredoute.fr',
    zipcode: '',
  },
  implementation,
};
