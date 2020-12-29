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

  const link = await context.evaluate(function () {
    return window.location.href;
  });

  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('#eky-dyson-iframe');
    // const src = iframe ? (iframe.src||iframe._src) : '';
    let src = '';
    if (iframe) {
        if (iframe.hasAttribute('src')) {
            src = iframe.getAttribute('src');
        } else if (iframe.hasAttribute('_src')) {
            src = iframe.getAttribute('_src');
        } else {
            console.log('we do not have any src in iframe');
        }
    } else {
        console.log('we do not have the iframe');
    }
    console.log('iframe src to go to - ' + src);

    return src;
});
//let content = null;
    if (src) {
        try {
            await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

            const witbData = await context.evaluate(async () => {
                const getInTheBox = document.querySelector('div.eky-accesory-container img');
                const getAccessories = document.querySelector('div.my-slider');
                const inBoxUrls = [];
                const inBoxurlsAccessories = [];
                let inBoxText = [];
                if(getAccessories){
                  const getAllAccessories = document.querySelectorAll('div.my-slider>div.eky-relative-wrapper.tns-normal>div.eky-overlay>div.lax');
                    for (let i = 0; i < getAllAccessories.length; i++) {
                        inBoxText.push(getAllAccessories[i].querySelector('h1').innerText);
                    }
                }
                if (getInTheBox) {
                    const getAllProducts = document.querySelectorAll('div.eky-accesory-container > div.eky-accessory');
                    for (let i = 0; i < getAllProducts.length; i++) {
                        inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute('src'));
                        inBoxText.push(getAllProducts[i].querySelector('div').innerText);
                    }
                }
                return { inBoxText, inBoxUrls };
            });

            await context.goto(link, { timeout: 15000 });
            await context.waitForSelector('#inpage_container', { timeout: 10000 });

            await context.evaluate(async (witbData) => {
              function addHiddenDiv (id, content) {
                const newDiv = document.createElement('div');
                newDiv.id = id;
                newDiv.textContent = content;
                newDiv.style.display = 'none';
                document.body.appendChild(newDiv);
              }

              const {inBoxText=[],inBoxUrls=[]} = witbData;

              for(let i=0;i<inBoxText.length;i++){
                addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
                if(inBoxUrls[i]){                 
                  addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
                }
              }
            },witbData);
            //await context.waitForSelector('div#main-section', { timeout: 45000 });


        } catch (error) {
            try {
                await context.evaluate(async function (src) {
                    window.location.assign(src);
                }, src);
                await context.waitForSelector('div.eky-container-full');
                return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
            } catch (err) {
                console.log(err);
            }
        }
        // return await context.extract(productDetails, { transform });
    } else {
        console.log('we do not have the src for iframe');
    }
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
      specContentList = specContentList.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').replace(/(\|\| ){1,}$/g, ' ').replace(/(\|\| ){2,}/g, '|| ').trim().replace(/(^\|\| )/, ' ').trim();
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
