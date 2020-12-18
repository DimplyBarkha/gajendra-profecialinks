const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'powercity',
    transform,
    domain: 'powercity.ie',
    zipcode: '',
  },
  implementation
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const prodDetails = await context.evaluate(async function () {
    const prodUrl = document.URL;
    return {
      url: prodUrl
    };
  });

  console.log('ID:' + prodDetails.id);
  try {
    await context.waitForSelector('iframe#eky-dyson-iframe');
  } catch (e) {
    console.log("No iframe found");
  };

  const isIframeExists = await context.evaluate(async function () {
    if (document.querySelector('iframe#eky-dyson-iframe')) {
      return {
        exists: true,
        iframeUrl: document.querySelector('iframe#eky-dyson-iframe').hasAttribute('src') ? document.querySelector('iframe#eky-dyson-iframe').getAttribute('src') : ""
      };
    } else {
      return {
        exists: false,
        iframeUrl: ''  
      } 
    }
  });
  //Goto enhancedContent iframce

  if (isIframeExists.exists) {
    await context.goto(`https:${isIframeExists.iframeUrl}`, { timeout: 80000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

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
      await new Promise((resolve) => setTimeout(resolve, 8000));
    });
    console.log('tefdf')
    const enhancedContent = await context.evaluate(async function () {
      let enhancedContent = {};
      enhancedContent.description = document.body.innerText.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' ');
      enhancedContent.videos = [];
      [...document.querySelectorAll('video')].forEach(q => {
        if (q.hasAttribute("src")) {
          enhancedContent.videos.push(q.getAttribute('src'));
        }
      });
      enhancedContent.images = [];
      [...document.querySelectorAll('div[class*=accesory-container] img')].forEach(q => {
        if (q.hasAttribute('src')) {
          enhancedContent.images.push(q.getAttribute('src'));
        }
      })
      const specifications = document.querySelectorAll('div#specifications div.eky-specs-col');
      enhancedContent.specArr = [];
      if (specifications) {
        console.log('specificationsswe')
        console.log(specifications)
        specifications.forEach(e => {
          enhancedContent.specArr.push(e.innerText.replace(/\n{2,}/g, ' ').replace(/\s{2,}/g, ' ').trim());
        });
      }
      return enhancedContent;
    });

    const inTheBox = await context.evaluate(async function () {
      let inTheBox = {};
      inTheBox.text = [];
      inTheBox.images = [];
      [...document.querySelectorAll('div.eky-accessory')].forEach(element => {
        if (element.querySelector('img').hasAttribute('src')) {
          inTheBox.images.push('//media.flixfacts.com/eyekandy/dyson/v11/en/'+element.querySelector('img').getAttribute('src'));
        }
        if (element.querySelector('.eky-accesory-title')) {
          inTheBox.text.push(element.querySelector('.eky-accesory-title').innerText);
        }
      });
      return inTheBox;
    });

    await context.goto(prodDetails.url, { timeout: 80000, waitUntil: 'load', checkBlocked: true });

    const compare = await context.evaluate(async function () {
      return (!!document.querySelector('.flix-comp-mainTitle') && document.querySelector('.flix-comp-mainTitle').offsetHeight > 0 && document.querySelector('.flix-comp-mainTitle').offsetWidth) > 0;
    });

    await context.evaluate(async function (enhancedContent, inTheBox, compare) {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      console.log(enhancedContent);
      addHiddenDiv('manufacturerDescription', enhancedContent['description']);
      enhancedContent.videos.forEach(q => {
        addHiddenDiv('enhancedContentVideo', `https://media.flixfacts.com/eyekandy/dyson/v11/en/${q}`);
      });

      enhancedContent.images.forEach(q => {
        addHiddenDiv('enhancedContentImages', `https://media.flixfacts.com/eyekandy/dyson/v11/en/${q}`);
      });
      addHiddenDiv('specifications', enhancedContent['specArr'].join(' || '))

      inTheBox.images.forEach(q => {
        addHiddenDiv('inTheBoxImg', `${q} 200w`);
      });

      inTheBox.text.forEach(q => {
        addHiddenDiv('inTheBoxText', q);
      });
      console.log('comparefddf')
      console.log(compare)
      if (compare) {
        addHiddenDiv('ii_compare', 'Yes');
      }
    }, enhancedContent, inTheBox, compare);
  }
  await context.extract(productDetails,{ transform });
}