const { transform } = require('../format.js');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const prodUrl = await context.evaluate(async function() {
    return document.URL;
  })

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
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await applyScroll(context);

  try {
    await context.waitForSelector('#eky-dyson-iframe', {timeout: 30000});
  } catch(er) {
    console.log(er.message);
  }

  const isIframePresnent = await context.evaluate(async function() {
    if(document.querySelector('#eky-dyson-iframe')) {
      return true;
    } else {
      return false;
    }
  });

  const iframeUrl = await context.evaluate(async function() {
    if(document.querySelector('#eky-dyson-iframe') && document.querySelector('#eky-dyson-iframe').hasAttribute('src')) {
      return document.querySelector('#eky-dyson-iframe').getAttribute('src');
    } else {
      return null;
    }
  });

  let inpageData = null;
  if(isIframePresnent && iframeUrl) {
    await context.goto(iframeUrl, { timeout: 10000, waitUntil: 'load' });
    inpageData = await context.evaluate(async function() {
      let inpageData = {};
      inpageData.text = [];
      inpageData.urls = [];
      document.querySelectorAll('.eky-accesory-title').forEach(q => {
        inpageData.text.push(q.innerText);
      });
      document.querySelectorAll('.eky-accessory img').forEach(q => {
        if(q.hasAttribute('src')) {
          inpageData.urls.push(`https://media.flixfacts.com/eyekandy/dyson/v11/fr` + q.innerText);
        }
      });
      return inpageData;
    })
    await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load' });
  }

  await context.evaluate(async function (inpageData) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    console.log('page is loaded successfully....executing scrolling code');
    // Scrolling till specifications as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 5000));
    async function scrollToLoadAplusImages () {
      let scrollSelector = document.querySelector('div[id="presContent"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div[id="descContent"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    await scrollToLoadAplusImages();
    console.log('scrolling code execution complete.....');

    const descriptionSelector = document.querySelectorAll('div[id="inpage_container"], div[id="presContent"] , div[id="descContent"]');
    let description = '';
    descriptionSelector && descriptionSelector.forEach(element => {
      // @ts-ignore
      description += element.innerText;
    });
    if(inpageData) {
      addHiddenDiv('inpageurls', inpageData.urls.join(" | "));
      addHiddenDiv('inpagetext', inpageData.text.join(" | "));
    }
    try {
      // @ts-ignore
      const video = JSON.parse(document.evaluate('//script[contains(@type,"application/ld+json") and contains(text(),"VideoObject")] ', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText);
      video && video.url && addHiddenDiv('pd_video', video.url);
    } catch (error) {
      console.log('videos not present');
    }
    // description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
    description && addHiddenDiv('added-manufacturerDesc', description);
  },inpageData);
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const manuData = document.querySelector('div[id="syndi_powerpage"]  div[class*="syndigo-shadowed-powerpage"]');
    const getShadowDomHtml = (manuData) => {
      if (manuData && manuData.shadowRoot) {
        let imagesHtml = manuData.shadowRoot.childNodes[0];
        imagesHtml = imagesHtml.querySelectorAll('img') || '';
        if (imagesHtml && imagesHtml.length) {
          imagesHtml.forEach(element => {
            addHiddenDiv('manu_img', element.src);
          });
        }
      }
    };
    getShadowDomHtml(manuData);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.fr',
    zipcode: "''",
  },
  implementation,
};
