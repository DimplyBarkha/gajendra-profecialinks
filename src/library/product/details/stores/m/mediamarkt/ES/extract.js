// const { transform } = require('../TR/transform');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('div[class*="RichProductDescription"] button');
  } catch (error) {
    console.log(error)
  }
  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });

  await context.evaluate(() => {
    async function infiniteScroll() {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    infiniteScroll();
  });

  // For enhanced content
  // try {
  //   await context.waitForSelector('div[class*="RichProductDescription"] button', { timeout: 30000 });
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   await context.click('div[class*="RichProductDescription"] button');
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   await context.waitForSelector('.main-content, .a-plus-content img');
  //   const aplusImages = await context.evaluate(() => {
  //     const images = document.evaluate(
  //       '//div[contains(@class,"flix-background-image")]//img/@srcset',
  //       document,
  //       null,
  //       XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  //       null,
  //     );
  //     let img = '';
  //     for (let i = 0; i < images.snapshotLength; i++) {
  //       let item = images.snapshotItem(i).textContent;
  //       img = img + (img ? ' | ' : '') + item;
  //     }
  //     return img;
  //   });

  //   addElementToDocument('aplusImages', aplusImages);
  //   const manufDescription = await context.evaluate(() => {
  //     const desc = document.evaluate(
  //       '//div[contains(@class,"flix-std-title") or contains(@class,"flix-std-desc")]',
  //       document,
  //       null,
  //       XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  //       null,
  //     );
  //     let text = '';
  //     for (let i = 0; i < desc.snapshotLength; i++) {
  //       const item = desc.snapshotItem(i).textContent;
  //       text = text + (text ? ' ' : '') + item;
  //     }
  //     return text;
  //   });

  //   addElementToDocument('manufacturerDescription', manufDescription);
  //   const videoId = document.evaluate("//div[contains(@class,'flix-videocontainer')]//input/@value", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //   let video = videoId && videoId.textContent.replace(/(.*){"file":"\\\/\\\/(.+)(.mp4)"(.*)/g, 'https://$2$3');
  //   addElementToDocument('added_video', video);

  //   function addElementToDocument(key, value) {
  //     const catElement = document.createElement('div');
  //     catElement.id = key;
  //     catElement.textContent = value;
  //     catElement.style.display = 'none';
  //     document.body.appendChild(catElement);
  //   }
  // } catch (e) {
  //   console.log(e.message);
  // }



  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
  implementation,
};
