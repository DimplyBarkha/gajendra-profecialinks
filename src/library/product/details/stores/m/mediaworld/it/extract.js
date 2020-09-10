
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'it',
    store: 'mediaworld',
    transform: null,
    zipcode: '',
    domain: 'mediaworld.it',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    try {
      await context.click('li[data-target="specifiche"]');
      await context.waitForSelector('div[data-target="specifiche"]');
      // await context.click('li.view-more-specs')
      // await context.waitForSelector('li.hidden-specs');
      await context.click('li[data-target="resi"]');
      await context.waitForSelector('div[data-target="resi"]');
      await context.click('li[data-target="recensioni"]');
      await context.click('li[data-target="description"]');
      await context.waitForSelector('div[data-target="description"]');
      await context.evaluate(() => {
        var body = document.querySelector('body')
        var avail = document.querySelector('a.avvisami-btn')
        if (!avail) {
          var new1 = document.createElement("div");
          new1.className = 'avilable';
          new1.setAttribute('availability', "In stock");
          body.append(new1);
        }
        else {
          var new1 = document.createElement("div");
          new1.className = 'avilable';
          new1.setAttribute('availability', "out of stock");
          body.append(new1);
        }
      });
      await context.evaluate(() => {
        const scrpt = document.querySelector('#popup-product-detail-main');
        const newdiv = document.createElement('div');
        newdiv.className = 'findVideo';
        newdiv.innerHTML = scrpt.innerHTML;
        const bdy = document.querySelector('body');
        bdy.append(newdiv);
        const frame1 = document.querySelector('div.findVideo > div > div > div.thumb-media-container > a > img');
        const iframehtml = frame1.getAttribute('data-iframe');
        const myvideo1 = document.createElement('div');
        myvideo1.className = 'videolink';
        myvideo1.innerHTML = iframehtml;
        bdy.append(myvideo1);
        const lnk = document.querySelector('div.videolink > iframe').getAttribute('src');
        const videoDiv2 = document.createElement('div');
        videoDiv2.className = 'myvdo';
        videoDiv2.setAttribute('lnk', lnk);
        bdy.append(videoDiv2);
      });
      await context.evaluate(() => {

      });
    } catch (e) {
      console.error(e);
    } finally {
      await context.extract(productDetails, { transform })
    }
  }
};