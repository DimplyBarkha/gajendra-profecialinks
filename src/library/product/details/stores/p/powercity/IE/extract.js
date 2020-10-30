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

    const enhancedContent = await context.evaluate(async function () {
      let enhancedContent = {};
      enhancedContent.description = document.body.innerText;
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
      return enhancedContent;
    });

    await context.goto(prodDetails.url, { timeout: 80000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(async function (enhancedContent) {
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
    }, enhancedContent);
  }
  await context.extract(productDetails, transform);
}