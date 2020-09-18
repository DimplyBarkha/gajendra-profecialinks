// @ts-nocheck
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
      const id = element.getAttribute('data-target');
      const specHead = document.querySelectorAll(`div[id*=${id}] td[class*='desc']`) ? document.querySelectorAll(`div[id*=${id}] td[class*='desc']`) : null;
      const specVal = document.querySelectorAll(`div[id*=${id}] td[class*='data']`) ? document.querySelectorAll(`div[id*=${id}] td[class*='data']`) : null;
      let specContent = '';
      for (let i = 0; i < specHead.length; i++) {
        if (specHead[i] && specVal[i]) {
          specContent += specHead[i].innerText + ' : ';
          specContent += specVal[i].innerText + ' || ';
        }
      }
      const specList = document.querySelectorAll(`div[id*=${id}] li , div[id*=${id}] p`) ? document.querySelectorAll(`div[id*=${id}] li , div[id*=${id}] p`) : null;
      let specContentList = '';
      for (let i = 0; i < specList.length; i++) {
        let text = '';
        if (specList[i] && specList[i].innerText) {
          if (specList[i].innerText.includes('Color')) {
            text = specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
            text.length < 50 && addHiddenDiv('ii_color', specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim());
          } else if (specList[i].innerText.includes('Dimensioni oggetto')) {
            text = specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
            text.length < 50 && addHiddenDiv('ii_dimension', specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim());
          } else if (specList[i].innerText.includes('Numero di colli')) {
            text = specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
            text.length < 50 && addHiddenDiv('ii_packSize', specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim());
          } else if (specList[i].innerText.includes('Peso')) {
            text = specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
            text.length < 50 && addHiddenDiv('ii_weight', specList[i].innerText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim());
          }
          specContentList += specList[i].innerText + ' || ';
        }
      }
      specContentList = specContentList.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').replace(/(\|\| ){1,}$/g, ' ').replace(/(\|\| ){2,}/g, '|| ').replace(/(^\|\| )/, ' ').trim();
      console.log('Specification list', specContentList);
      specContentList && addHiddenDiv('ii_spec', specContentList);
      specContent && addHiddenDiv('ii_spec', specContent.slice(0, -4));
    }
    // rating
    const iframeNode = (document.querySelector('div[class*="caption__revoo"] iframe')) ? document.querySelector('div[class*="caption__revoo"] iframe').contentDocument.documentElement.innerHTML : null;
    const domparser = new DOMParser();
    if (iframeNode) {
      const iframeDOM = domparser.parseFromString(iframeNode, 'text/html');
      const review = iframeDOM.querySelector("div[class*='number-of-reviews']");
      console.log('Review count', review.innerText);
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
    descContent = descContent.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim();
    if (descBullets && descContent) {
      console.log('Description', (descBullets + ' | ' + descContent));
      addHiddenDiv('ii_desc', (descBullets + ' | ' + descContent));
    } else if (descBullets) {
      console.log('Description', descBullets);
      addHiddenDiv('ii_desc', (descBullets));
    } else if (descContent) {
      console.log('Description', descContent);
      addHiddenDiv('ii_desc', (descContent));
    }
    // sk
    const skuJSON = (document.querySelector('script[type*="application/ld+json"]')) ? document.querySelector('script[type*="application/ld+json"]').innerText : {};
    if (skuJSON) {
      const skuParsed = JSON.parse(skuJSON) && JSON.parse(skuJSON).sku ? JSON.parse(skuJSON).sku : '';
      console.log('SKU', (skuParsed));
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
