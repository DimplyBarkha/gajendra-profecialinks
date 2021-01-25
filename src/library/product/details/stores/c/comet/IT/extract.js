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
  // let content = null;
  let backGroundVideoUrls = [];
  if (src) {
    try {
      await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

      try {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const applyScroll = async function (context) {
          await context.evaluate(async function () {
            async function stall (ms) {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  console.log('waiting!!');
                  resolve();
                }, ms);
              });
            }
            let scrollTop = 0;
            while (scrollTop !== 15000) {
              await stall(1000);
              scrollTop += 1000;
              window.scroll(0, scrollTop);
              console.log('scrolling now!!');
              if (scrollTop === 15000) {
                await stall(3000);
                break;
              }
            }
          });
        };

        await applyScroll(context);
      } catch (err) {
        console.log('some error occured while scrolling', err.message);
      }

      console.log('done scrolling!!');

      const witbData = await context.evaluate(async () => {
        const getInTheBox = document.querySelector('div.eky-accesory-container img');
        const getAccessories = document.querySelector('div.my-slider');
        const inBoxUrls = [];
        const inBoxurlsAccessories = [];
        const inBoxText = [];
        if (getAccessories) {
          const getAllAccessories = document.querySelectorAll('div.my-slider>div.eky-relative-wrapper.tns-normal');
          for (let i = 0; i < getAllAccessories.length; i++) {
            inBoxUrls.push(getAllAccessories[i].querySelector('div.eky-header-video-container>video').getAttribute('src'));
            inBoxText.push(getAllAccessories[i].querySelector('div.eky-overlay>div.lax').innerText);
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

      backGroundVideoUrls = await context.evaluate(async (src) => {
        const allVideosSel = 'div.eky-header-video-container>video';
        const allVideoElm = document.querySelectorAll(allVideosSel);
        const allBackgrndVid = [];
        if (!allVideoElm || (allVideoElm.length === 0)) {
          return allBackgrndVid;
        }
        const regex = /(.+)\/index.html(.+)/g;
        const prefixUrl = src.replace(regex, '$1');
        for (let i = 0; i < allVideoElm.length; i++) {
          if (!allVideoElm[i].parentElement.parentElement.className.includes('tns-item')) {
            const thisUrl = prefixUrl + '/' + allVideoElm[i].getAttribute('src');
            allBackgrndVid.push(thisUrl);
            console.log(thisUrl);
          }
        }
        return allBackgrndVid;
      },
      src);

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

        const { inBoxText = [], inBoxUrls = [] } = witbData;

        for (let i = 0; i < inBoxText.length; i++) {
          addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
          if (inBoxUrls[i]) {
            addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
          }
        }
      }, witbData);
      // await context.waitForSelector('div#main-section', { timeout: 45000 });
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
      const rating = parseFloat(iframeDOM.querySelector('reevoo-score').getAttribute('data-score'));
      console.log('Rating ', rating / 2);
      addHiddenDiv('ii_rating', rating / 2);
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

  await context.evaluate(async () => {
    try {
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
      console.log('done scrolling!! on prod page');
    } catch (err) {
      console.log('error while scrolling');
    }
  });

  try {
    context.waitForXPath("//div[contains(@class,'fullJwPlayerWarp')]//input");
    console.log('video input elm loaded');
  } catch (err) {
    console.log('error while waiting for video input elm', err.message);
    console.log('waiting again');
    try {
      context.waitForXPath("//div[contains(@class,'fullJwPlayerWarp')]//input");
      console.log('video input elm loaded');
    } catch (error) {
      console.log('error while waiting for video input elm -- again', error.message);
    }
  }
  await context.evaluate(preparePage);

  await context.evaluate(async (backGroundVideoUrls) => {
    async function addElementToDocumentAsync (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      document.body.appendChild(catElement);
    }

    await addElementToDocumentAsync('backgrndvideo', backGroundVideoUrls.join(' || '));
  },
  backGroundVideoUrls);
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
