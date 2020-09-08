const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  var url = await context.evaluate(async function () {
    const url = window.location.href;
    // console.log('url',window.location.href);
    // const searchUrlDiv = document.createElement('div');
    // searchUrlDiv.classList.add('my-search-url');
    // searchUrlDiv.style.display = 'none';
    // searchUrlDiv.textContent = url;

    // document.body.appendChild(searchUrlDiv);

    let productString = document.querySelector(".ebx-results-number").textContent;
    let productCount = productString.match(/\d/g).join("");
    let totalPage = Math.ceil(parseInt(productCount) / 20) ;

    var mySubString = url.substring(
      url.lastIndexOf("q=") + 2
    );

    const paginationUrl = `https://www.carrefour.es/?q=${mySubString}&page=${totalPage}`;
    return paginationUrl;
  });

  await context.setAntiFingerprint(false);
  await context.setLoadAllResources(true);
  await context.setBlockAds(false);

  await context.goto(url.toString(), { timeout: 80000, waitUntil: 'load', checkBlocked: true });
  //await context.goto( url.toString() );

  await context.evaluate(async function () {
    const url = window.location.href;
    console.log('url',window.location.href);
    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;

    document.body.appendChild(searchUrlDiv);

  });

  const loadedSelector = "section[id='ebx-grid']";
  const noResultsXPath = "//font[contains(text(),'Aucun résultat trouvé, veuillez modifier les termes de votre recherche.')]";

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation
};
