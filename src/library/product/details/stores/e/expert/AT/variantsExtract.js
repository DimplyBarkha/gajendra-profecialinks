async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    let variantList = [];
    let variantUrl = [];

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let noResultsXpath = '//div[contains(@class,"findologic-result") and contains(.,"Keine Ergebnisse für")]';
    let noResultsElm = document.evaluate(noResultsXpath, document, null, 7, null);
    if (noResultsElm.snapshotLength > 0) {
      console.log('we have no results - not moving further');
      return;
    } else {
      console.log('we have some results');
    }

    console.log(' we are on this page as of now - ' + window.location.href);
    let urlLists = document.querySelectorAll('div[class*="product-item is-clickable"] div[class*="product-item-desc"] h2 a');

    const regex = /~p(.+)\?/g;
    for(let index = 0; index < urlLists.length; index++) {
      if (urlLists[index] && urlLists[index].href) {
        let matches = urlLists[index].href.matchAll(regex);
        for(let match of matches) {
          variantUrl.push('https://www.expert.at/shop/?q=' + match[1] + '&perPage=50');
          variantList.push(match[1]);
          console.log('https://www.expert.at/shop/?q=' + match[1] + '&perPage=50');
        }
      } else {
        console.log('either there is no anchor element or no href');
      }
    }

    // function getVariantsText (url) {
    //   let variantUrl = url.match(/(?<=~p)(.*)(?=\?)/gm) ? url.match(/(?<=~p)(.*)(?=\?)/gm)[0] : '';
    //   if (variantUrl.length === 0) {
    //     variantUrl = url.match(/(?<=~p)(.*)(?=)/gm) ? url.match(/(?<=~p)(.*)(?=)/gm)[0] : '';
    //   }
    //   return variantUrl;
    // }

    // const url = window.location.href.split('#[!opt!]')[0];
    // variantUrl.push(url);
    // const mainVariant = getVariantsText(url);
    // variantList.push(mainVariant);

    // const variantNodes = document.querySelectorAll('select.product-variant option');
    // if (variantNodes.length) {
    //   [...variantNodes].forEach((element) => {
    //     const text = element.getAttribute('value');
    //     variantList.push(text);
    //     const variantUrlText = element.getAttribute('data-href');
    //     variantUrl.push(`https://www.expert.at${variantUrlText}`);
    //   });
    // }

    const variants = new Set(variantList);
    let index = 0;
    variants.forEach((element) => {
      addHiddenDiv(`ii_variantid-${index}`, element);
      index++;
    });
    const variantLinks = new Set(variantUrl);
    index = 0;
    variantLinks.forEach((element) => {
      addHiddenDiv(`ii_variantUrl-${index}`, element);
    });
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: null,
    domain: 'expert.at',
    zipcode: '',
  },
  implementation,
};
