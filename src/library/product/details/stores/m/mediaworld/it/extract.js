const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    transform: cleanUp,
    zipcode: '',
    domain: 'mediaworld.it',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    try {
      // clicking on the specifiche button and waiting for the div to load
      const specifiche = await context.evaluate(() => {
        return document.querySelector('li[data-target="specifiche"]');
      });
      if (specifiche) {
        await context.click('li[data-target="specifiche"]');
        await context.waitForSelector('div[data-target="specifiche"]');
      }
      // clicking on the Resi e garanzie button and waiting for the div to load
      const resi = await context.evaluate(() => {
        return document.querySelector('div[data-target="resi"]');
      });
      if (resi) {
        await context.click('li[data-target="resi"]');
        await context.waitForSelector('div[data-target="resi"]');
      }
      // clicking on the description button and waiting for the div to load
      const description = await context.evaluate(() => {
        return document.querySelector('div[data-target="description]');
      });
      if (description) {
        await context.click('li[data-target="description"]');
        await context.waitForSelector('div[data-target="description"]');
      }
      // code for getting the availability information
      await context.evaluate(() => {
        const body = document.querySelector('body');
        const avail = document.querySelector('a.avvisami-btn');
        if (!avail) {
          const new1 = document.createElement('div');
          new1.className = 'available';
          new1.setAttribute('availability', 'In stock');
          body.append(new1);
        } else {
          const new2 = document.createElement('div');
          new2.className = 'available';
          new2.setAttribute('availability', 'Out of Stock');
          body.append(new2);
        }
      });
      // code for getting the videolink
      await context.evaluate(() => {
        const script = document.querySelector('#popup-product-detail-main');
        // const body = document.querySelector('body');
        if (script) {
          const newdiv = document.createElement('div');
          newdiv.className = 'find-Video';
          newdiv.innerHTML = script.innerHTML;
          document.body.append(newdiv);
        }
        const frame1 = document.querySelector('div.find-Video > div > div > div.thumb-media-container > a > img');
        if (frame1) {
          const iframehtml = frame1.getAttribute('data-iframe');
          const myVideo1 = document.createElement('div');
          myVideo1.className = 'video-Link';
          myVideo1.innerHTML = iframehtml;
          document.body.append(myVideo1);
        }
        const frame2 = document.querySelector('div.video-Link > iframe');
        if (frame2) {
          const link = document.querySelector('div.video-Link > iframe') && document.querySelector('div.video-Link > iframe').getAttribute('src');
          const videoDiv2 = document.createElement('div');
          videoDiv2.className = 'my-video';
          videoDiv2.setAttribute('link', link);
          document.body.append(videoDiv2);
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      await context.extract(productDetails, { transform });
    }
  },
};
