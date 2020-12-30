const { transform } = require('../../bestbuy/format')
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.captureRequests();
    try{
    await context.waitForSelector('button[data-track*="From the Manufacturer"]')
    await context.click('button[data-track*="From the Manufacturer"]')
    await context.waitForSelector('iframe.manufacturer-content-iframe')
    } catch (error){
      console.log('Manufacturer contents are not loaded')
    }
    try {
      await context.click('li.video-thumbnail')
      await context.waitForSelector('div.video-thumbnail-wrapper')
    } catch (error) {
      console.log('there are no videos');
    }
    await context.evaluate(async function () {
      for (const element of document.querySelectorAll('div.video-thumbnail-wrapper li button')) {
        element.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    })
    const request = await context.searchAllRequests('videos') || [];
    const videos = new Set(request.map(({url})=>url));
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    await context.evaluate(async function (videos) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      for (const [index, video] of videos.entries()) {
        addHiddenDiv(`ii_video_${index}`, video)
      }
      try {
        document.querySelector('li.image-more-thumbnail button').click()
      } catch (error) {
        console.log('No extra Image',error);
      }
      const descContent = (document.querySelector('div.overview-accordion-content-wrapper')) ? document.querySelector('div.overview-accordion-content-wrapper').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      descContent && addHiddenDiv('ii_description', descContent);
      const iframe = document.querySelector('iframe.manufacturer-content-iframe')
      if (iframe) {
        iframe.scrollIntoView({behavior: "smooth"})
        await new Promise(resolve => setTimeout(resolve, 5000))
        try {
          let container = document.querySelector('div.shop-manufacturer-content');
          const manufaturerContents = iframe.contentDocument.documentElement.innerHTML.replace(/<div\s*class="wc-json-data".*?<\/div>/g, ' ');
          if(/360-view/i.test(manufaturerContents)){
            addHiddenDiv('roundimg','Yes')
          }
          container.innerHTML = manufaturerContents
        } catch (error) {
          console.log(error);
        }
      }
    }, Array.from(videos))
  } catch (error) {
    console.log(error);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation,
};
