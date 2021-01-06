const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const pageUrl = await context.evaluate(function () {
    return window.location.href;
  });
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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await applyScroll(context);
  await context.setBlockAds(false);
  try {
    await context.waitForSelector('span[id*=inpage-data]', {timeout: 20000});
  } catch(er) {
    console.log("coundn't find flix id");
  }

  const flixid = await context.evaluate(async function() {
      const flixIdNode = document.querySelector('span[id*=inpage-data]');
      if(flixIdNode) {
        return flixIdNode.getAttribute('id').match(/\d+/g)[0];
      } else {
        return null;
      }
  });

  if(flixid) {
    await context.goto(`https://media.flixcar.com/delivery/inpage/show/14387/at/${flixid}/`, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 20000,
      waitUntil: 'load',
    });

    const enhancedContent = await context.evaluate(async function() {
      let content = {};
      content.description =  document.body.innerText;
      content.images = [];
      content.videos = [];

      const imagesNodes = document.querySelectorAll('img[class*=flix-img]');
      imagesNodes.forEach(q => {
        if(q.hasAttribute('data-flixsrcset')) {
          let matches = q.getAttribute('data-flixsrcset').match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)[0]; //url regex
          content.images.push(matches)
        }
      })

      const videoNodes = document.querySelectorAll('iframe[title*=video]');
      videoNodes.forEach(q => {
        if(q.hasAttribute('src')) {
          content.videos.push(q.getAttribute('src'));
        }
      });
      return content;
    });

    await context.goto(pageUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function(enhancedContent) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      addHiddenDiv('manufacturerDescription', enhancedContent.description);
      addHiddenDiv('manufacturerImages', enhancedContent.images.join(" | "));
      addHiddenDiv('videos', enhancedContent.videos.join(" | "));

    }, enhancedContent)
  }
  
  //await context.setLoadAllResources(true); 
  //await context.setLoadImages(true);
  //await context.setJavaScriptEnabled(true); 
  //await context.setAntiFingerprint(false);
  // await context.setUseRelayProxy(false);

  // await context.goto('https://media.flixcar.com/delivery/static/inpage/57/js/lazysizes.js');
  //   await context.evaluate(async function () {
  //     console.log(document.querySelector('h1.next-chapter'));
  //   });
  //   const text = await context.evaluate(async function () {
  //     return document.querySelector('body').innerText;
  //   });
  // elementID = 'manuf';
  // content = text;



  return context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ek-onlineshop',
    transform,
    domain: 'ek-onlineshop.at',
    zipcode: '',
  },
  implementation
};
