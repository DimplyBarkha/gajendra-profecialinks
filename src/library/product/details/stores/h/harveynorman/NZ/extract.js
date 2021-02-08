const { transform } = require('../format')
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let description = document.querySelector('div#content_description > div.product-tab-wrapper');

    // @ts-ignore
    description = description ? description.children : [];

    let finalDescription = '';
    let flag = false;
    // @ts-ignore
    for (const element of description) {
      if (element.id === 'flix-inpage') {
        break;
      };

      if (!element.innerText) {
        continue;
      }
      if (element.nodeName === 'UL') {
        flag = true;
        for (const li of element.children) {
          finalDescription += ` || ${li.innerText}`;
        }
      } else if (element.nodeName === 'LI') {
        flag = true;
        finalDescription += ` || ${element.innerText}`;
      } else {
        if (flag) {
          flag = false;
          finalDescription += ` | ${element.innerText}`;
        } else {
          flag = false;
          finalDescription += ` ${element.innerText}`;
        }
      }
    }
    addHiddenDiv('ii_description', finalDescription);
  });
  try {
    await context.waitForSelector('iframe#eky-dyson-iframe');
  } catch (err) {
    console.log('iframe manufacturer contents not loaded or unavailable');
  }

  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });

  const iframeUrl = await context.evaluate(async function () {
    const iframe = document.querySelector('iframe#eky-dyson-iframe');
    // @ts-ignore
    const src = iframe ? iframe.src : '';
    return src;
  });

  try {
    if (iframeUrl) {

      // navigating to iframe src
      // @ts-ignore
      await context.goto(iframeUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }
  } catch (error) {
    console.log('could not load page', error);
  }

  const inTheBoxUrl = await context.evaluate(async function () {

    const imgArray = document.querySelectorAll('div.eky-relative-wrapper div.eky-header-video-container video, div.eky-accessory img');
    const inTheBoxUrlArray = [];
    imgArray.forEach(img => {
      // @ts-ignore
      if (img.src) {
        // @ts-ignore
        inTheBoxUrlArray.push(img.src);
      }
    })

    const textArray = document.querySelectorAll('div#customize-iw h1.eky-smaller, div.eky-accesory-title');
    const inTheBoxText = [];
    textArray.forEach(txt => {
      // @ts-ignore
      if (txt.innerText) {
        // @ts-ignore
        inTheBoxText.push(txt.innerText);
      }
    });
    console.log('inTheBox code execution complete');

    return { inTheBoxUrlArray, inTheBoxText };
  });

  // @ts-ignore
  await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

  await context.evaluate(async (inTheBoxUrl) => {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // @ts-ignore

    inTheBoxUrl.inTheBoxText.forEach(item => {
      addHiddenDiv('added_inTheBoxText', item);
    });

    inTheBoxUrl.inTheBoxUrlArray.forEach(item => {
      addHiddenDiv('added_inTheBoxUrl', item);
    });

  }, inTheBoxUrl);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.co.nz',
    zipcode: '',
  },
  implementation,
};
