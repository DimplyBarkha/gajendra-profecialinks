const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    transform,
    domain: 'worten.pt',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForSelector('.w-cookies-popup__wrapper .w-button-primary', { timeout: 10000 });
      await context.evaluate(function () {
        console.log('Clicking on button.');
        document.querySelector('.w-cookies-popup__wrapper .w-button-primary').click();
      });
    } catch (er) {
      console.log('Error while accepting cookies button.', er);
    }

    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
    await context.evaluate(async function () {
      const rating = document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext() && document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent && document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.replace(/(.+ratingValue":"([^"]+).+)/g, '$2');
      if (rating) {
        const Frating = Number(rating).toFixed(1).replace('.', ',');
        document.body.setAttribute('rating', Frating);
      }
      console.log('Scrolling to the bottom of page.');
      if (document.querySelector('.footer__bar')) {
        document.querySelector('.footer__bar').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }

      const descEl = document.querySelector('#flix-inpage');

      if (descEl) {
        const styleEl = descEl.querySelectorAll('style');
        const scriptEl = descEl.querySelectorAll('script');
        for (const el of styleEl) {
          el.remove();
        }
        for (const el of scriptEl) {
          el.remove();
        }
      }
      const removeSpecsIcon = document.querySelectorAll('span.w-tooltip');
      if (removeSpecsIcon.length) {
        removeSpecsIcon.forEach(e => e.remove());
      }
      const addPipeTospecs = document.querySelectorAll('span.details-label');
      if (addPipeTospecs.length) {
        addPipeTospecs.forEach(e => e.textContent = ` || ${e.textContent} : `);
      }
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    function getElementsByXPath(xpath, parent) {
        const results = [];
        const query = document.evaluate(xpath, parent || document,
            null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.replace(/(.+)(videos.+)(-1.+)/g, 'https://$2.mp4').trim();
            results.push(node);
        }
        return results.filter(e => e);
    }
    
    var videoImage = document.querySelector('div.w-container-full--product div.demoupUI-playimage');
    if (videoImage) {
        videoImage.click();
        await timeout(2000);
        const videoUrls = getElementsByXPath('(//meta[contains(@content,"//video")]/@content)[1] | //div[@class="demoupUI-playlist"]//div[@class="demoupUI-item"][position()>1]//img/@src');
        let removeDuplicatevideos = [...new Set(videoUrls)];
        const videos = removeDuplicatevideos.join(' | ')
        console.log(videos);
        document.querySelector('h1').setAttribute('videos', videos);
    }

    const bulletCount = document.querySelector('div.w-product-about-container') && document.querySelector('div.w-product-about-container').innerHTML.replace(/<br> -/g, ' || ').replace(/(<([^>]+)>)/ig, '').trim().split('||').length -1;
    
    if(bulletCount) {
      const bullets = bulletCount.toString();
     document.querySelector('h1').setAttribute('bullet-point', bullets);
    }
    });

    try {
      await context.waitForSelector('#flixmediaInsert', { timeout: 30000 });
    } catch (err) {
      console.log('Enhanced content did not load');
    }

    await context.extract(productDetails, { transform });
  },
};
