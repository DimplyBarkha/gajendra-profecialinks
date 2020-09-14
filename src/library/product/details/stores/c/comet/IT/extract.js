const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function preparePage () {
    // @ts-ignore
    document.querySelector("i[class*='popup']") && document.querySelector("i[class*='popup']").click();
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    // specifications
    var specsId = document.evaluate("//div[contains(@class,'tab-desc__labels__desc') and contains(.,'Specifiche tecniche')]", document, null, XPathResult.ANY_TYPE, null);
    var element = specsId.iterateNext();
    if (element) {
      // @ts-ignore
      const id = element.getAttribute('data-target');
      const specHead = document.querySelectorAll(`div[id*=${id}] td[class*='desc']`) ? document.querySelectorAll(`div[id*=${id}] td[class*='desc']`) : null;
      const specVal = document.querySelectorAll(`div[id*=${id}] td[class*='data']`) ? document.querySelectorAll(`div[id*=${id}] td[class*='data']`) : null;
      let specContent = '';
      for (let i = 0; i < specHead.length; i++) {
        if (specHead[i] && specVal[i]) {
          // @ts-ignore
          specContent += specHead[i].innerText + ' : ';
          // @ts-ignore
          specContent += specVal[i].innerText + ' || ';
        }
      }
      specContent && addHiddenDiv('ii_spec', specContent.slice(0, -4));
    }
    // ratings
    // @ts-ignore
    const iframeNode = (document.querySelector('div[class*="caption__revoo"] iframe')) ? document.querySelector('div[class*="caption__revoo"] iframe').contentDocument.documentElement.innerHTML : null;
    const domparser = new DOMParser();
    if (iframeNode) {
      const iframeDOM = domparser.parseFromString(iframeNode, 'text/html');
      const review = iframeDOM.querySelector("div[class*='number-of-reviews']");
      console.log('review ', review);
      // @ts-ignore
      addHiddenDiv('ii_review', review.innerText);
      const rating = iframeDOM.querySelector('reevoo-score').getAttribute('data-score');
      console.log('Rating ', rating);
      addHiddenDiv('ii_rating', rating);
    }
    // descipiton
    const descBullets = (document.querySelector('div[class*="scheda-prodotto__info"] ul')) ? document.querySelector('div[class*="scheda-prodotto__info"] ul').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/&nbsp;/gm, '').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim() : '';

    var descNode = document.evaluate("//div[contains(@class,'tab-desc__body__desc') and contains(@class,'active')]/*[not(.//*[descendant::div[contains(@id, 'flix-inpage')]])]", document, null, XPathResult.ANY_TYPE, null);
    var descEle = descNode.iterateNext();
    let descContent = '';
    while (descEle) {
      descContent += descEle.textContent;
      descEle = descNode.iterateNext();
    }
    if (descBullets && descContent) {
      console.log('ii_desc', (descBullets + ' | ' + descContent));
      addHiddenDiv('ii_desc', (descBullets + ' | ' + descContent));
    } else if (descBullets) {
      addHiddenDiv('ii_desc', (descBullets));
    } else if (descContent) {
      addHiddenDiv('ii_desc', (descContent));
    }
    // sku
    // @ts-ignore
    const skuJSON = (document.querySelector('script[type*="application/ld+json"]')) ? document.querySelector('script[type*="application/ld+json"]').innerText : {};
    if (skuJSON) {
      const skuParsed = JSON.parse(skuJSON) && JSON.parse(skuJSON).sku ? JSON.parse(skuJSON).sku : '';
      console.log('ii_sku', (skuParsed));
      skuJSON && addHiddenDiv('ii_sku', (skuParsed));
    }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
  }
  await context.evaluate(preparePage);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'comet',
    transform,
    domain: 'comet.it',
    zipcode: '',
  },
  implementation,
};
