
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
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await context.waitForSelector('.w-cookies-popup__wrapper .w-button-primary', { timeout: 10000 });
      await context.evaluate(async function () {
        console.log('Clicking on button.');
        document.querySelector('.w-cookies-popup__wrapper .w-button-primary').click();
        await timeout(2000);
      });
    } catch (er) {
      console.log('Error while accepting cookies button.', er);
    }

    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
    await context.evaluate(async function () {
      console.log('Scrolling to the bottom of page.');
      if (document.querySelector('.footer__bar')) {
        document.querySelector('.footer__bar').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        console.log('Scrolling is done waiting for 2 sec');
        await timeout(2000);
      }

      const rating = document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext() && document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent && document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.replace(/(.+ratingValue":"([^"]+).+)/g, '$2');
      if (rating) {
        const Frating = Number(rating).toFixed(1).replace('.', ',');
        document.body.setAttribute('rating', Frating);
      }
      const descEl = document.querySelector('div#enhanced-content');
      const paginationText = document.querySelector('div#enhanced-content p.fl1xcarousel-pagination')
      if (paginationText) {
        paginationText.remove();
      }
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
          const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.replace(/(.+)(.com\/\w+\/\w+\/\w+\/\w+)(.+)/g, 'https://videos.demoup$2.mp4').trim();
          results.push(node);
        }
        return results.filter(e => e);
      }

      const videoImage = document.querySelector('div.w-container-full--product div.demoupUI-playimage');
      if (videoImage) {
        videoImage.click();
        await timeout(2000);
        const videoUrls = getElementsByXPath('(//meta[contains(@content,"//video")]/@content)[1] | //div[@class="demoupUI-playlist"]//div[@class="demoupUI-item"][position()>1]//img/@src');
        let removeDuplicatevideos = [...new Set(videoUrls)];
        const videos = removeDuplicatevideos.join(' | ')
        console.log(videos);
        document.querySelector('h1') && document.querySelector('h1').setAttribute('videos', videos);
      }

      const youtubeVideos = getElementsByXPath('//img/@data-plyr-embed-id');
      const youtubeVideosArr = [];
      youtubeVideos.forEach(e => {
        const video = e.replace(/(.+)/g, 'https://www.youtube.com/watch?v=$1');
        youtubeVideosArr.push(video);
      });

      const allYoutubeVideos = youtubeVideosArr.join(' | ');
      document.querySelector('h1') && document.querySelector('h1').setAttribute('youtube-videos', allYoutubeVideos);

      const bulletCount = document.querySelector('div.w-product-about-container') && document.querySelector('div.w-product-about-container').innerHTML.replace(/<br> -/g, ' || ').replace(/(<([^>]+)>)/ig, '').trim().split('||').length - 1;
      if (bulletCount) {
        const bullets = bulletCount.toString();
        document.querySelector('h1') && document.querySelector('h1').setAttribute('bullet-point', bullets);
      }
    });


    await context.evaluate(async function () {
      const enhanceContentVideos = [];
      const getVideoList = document.querySelector('div.fullJwPlayerWarp input');
      if (getVideoList) {
        const list = getVideoList.getAttribute('value');
        const videoObj = JSON.parse(list);
        if (videoObj && videoObj.playlist) {
          videoObj.playlist.forEach(element => {
            const video = element.file.replace(/(.+)/g, 'http:$1');
            enhanceContentVideos.push(video);
          });
        }
      }
      const allVideos = enhanceContentVideos.join(' | ');
      document.querySelector('h1') && document.querySelector('h1').setAttribute('enhance-videos', allVideos);
    })
    async function add() {
      const jsApi = document.querySelector('#flix-minisite no-script, #flix-inpage > script') && document.querySelector('#flix-minisite no-script, #flix-inpage > script').getAttribute('src');
      const jsApi2 = document.querySelector('[src*="ws.cnetcontent.com"]') && document.querySelector('[src*="ws.cnetcontent.com"]').src;
      if (jsApi) {
        let response = await fetch(jsApi);
        const js = await response.text();
        eval(js);
        const id = flixJsCallbacks.pid;
        response = await fetch(`https://media.flixcar.com/delivery/inpage/show/620/pt/${id}/json`);
        const html = JSON.parse((await response.text()).match(/^\((.+)\)$/)[1]).html;
        const div = document.createElement('div');
        div.id = 'enhanced-content';
        div.innerHTML = html;
        document.body.append(div);
      }
      
 
      if(jsApi2) {
        const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');  
    const response = await fetch(document.querySelector('[src*="ws.cnetcontent.com"]').src);
            const text = await response.text();
           const  text2 = clean(text);
            const array = text2.match(/"htmlBlocks"\s*:\s*(\[.+])\s*,\s*"sites"/)[1];
            const  html = unescape(array.match(/ccs-inline-content","html":"(.+)"/)[1].replace(/\\n/g,'')).replace(/\\"/g,'"').replace(/\\'/g,"'");
            const div = document.createElement('div');
            div.id = 'enhanced-content';
            div.innerHTML = html;
            document.body.append(div);
      }
    }
try {
  await context.evaluate(add);
} catch (error) {
  console.log(error);
  console.log('enhnace content not loaded');
}
    
    await context.extract(productDetails, { transform });
  },
};
