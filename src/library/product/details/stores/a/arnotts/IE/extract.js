const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    try {
      await context.waitForXPath('//button[contains(@id,"accept-btn") and contains(text(),"Accept All Cookies")]', {timeout : 15000});
      await context.click('button[id*="accept-btn"]');
      console.log('cookie button cliked');
    } catch(err) {
      console.log('something went wrong while waiting and clicking the cookie button - ', err.message);
    }
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // if (document.querySelector('div#flix-inpage-wrapper')) {
      //   const manuDesc = document.querySelector('div#flix-inpage').innerText;
      //   addHiddenDiv('manuDesc', manuDesc);
      // }
      if (document.querySelector('li#pdp-carousel-video img.productthumbnail')) {
        const videoData = JSON.parse(document.querySelector('li#pdp-carousel-video img.productthumbnail').getAttribute('data-lgimg'));
        if (videoData) {
          let videoUrl = videoData.videoData;
          videoUrl = videoUrl.replace('.json', '/mp4_720p');
          addHiddenDiv('videoUrl', videoUrl);
        }
      }
      if (document.querySelector('div.tab-content')) {
        if (document.querySelector('div.tab-content').getAttribute('itemprop') == 'description') {
          let desc = document.querySelector('div.tab-content').innerHTML;
          desc = desc.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
          addHiddenDiv('desc', desc);
        }
      }
    });

    // For inTheBoxText
    await context.evaluate(() => {
      const inBox = document.evaluate(
        '//div[@itemprop="description"]/li[preceding-sibling::p[1][strong[contains(text(),"In the Box")]]]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const values = [];
      for (let i = 0; i < inBox.snapshotLength; i++) {
        const item = inBox.snapshotItem(i);
        // @ts-ignore
        const strong = item.querySelector('strong');
        if (strong) {
          break;
        } else {
        // @ts-ignore
          const t = item.textContent;
          values.push(t);
        }
      }
      if(values.length) {
        const text = values.join('|| ');
        document.body.setAttribute('in-the-box-text', text);
      } else {
      // Second case. Ex:https://www.arnotts.ie/on/demandware.store/Sites-arnotts-global-Site/en_IE/Product-Variation?pid=1000124126
        
      const inBox = document.evaluate(
        '//div[@itemprop="description"]/li[contains(text(),"in the box?")]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const text = inBox.snapshotItem(0);
      if(text) {
        const witb = text.textContent.match(/[^\?]+$/)[0].split(',').map(text => text.trim().replace(/\./,'')).join(' || ');
        document.body.setAttribute('in-the-box-text', witb);
      }
      }
    });
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 500;
          window.scroll(0, scrollTop);
          console.log('scrolling again -- ');
          if (scrollTop === 20000) {
            await stall(2000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    let iframeSrc = await context.evaluate(async () => {
      let iframeElm = document.querySelector("#eky-dyson-iframe");
      let iframrUrl = '';
      if(iframeElm) {
        console.log('iframe is present!!');
        if(iframeElm.hasAttribute('src')) {
          iframrUrl = iframeElm.getAttribute('src');
        } else {
          console.log('no src is present');
        }
      } else {
        console.log('iframe is not present');
      }
      return iframrUrl;
    });

    console.log('iframeSrc', iframeSrc);

    let allVideosEnhancedContentArr = [];

    if(iframeSrc) {
      let thisProdPageUrl = await context.evaluate(async () => {
        return document.location.href;
      });
      console.log('thisProdPageUrl', thisProdPageUrl);
      let iframeGotoResp = await context.goto(iframeSrc, { first_request_timeout: 60000, timeout: 30000, waitUntil: 'load'});
      console.log('iframeGotoResp.status', iframeGotoResp.status);
      let allVideoEcSel = '*[class*="video"][src*="video"]';
      await new Promise((resolve, reject) => setTimeout(resolve, 4000));
      let EChasVideos = false;
      await applyScroll(context);
      try {
        await context.waitForSelector(allVideoEcSel);
        EChasVideos = true;
      } catch(err) {
        console.log('got into some error while waiting for videos in iframe', err.message);
        try {
          console.log('waiting again!!')
          await context.waitForSelector(allVideoEcSel);
          EChasVideos = true;
        } catch(err) {
          console.log('got into some error while waiting for videos in iframe, again', err.message);
        }
      }
      console.log('EChasVideos', EChasVideos);
      if(EChasVideos) {
        let regex = /(.+)\/((.+)\.(.+))\?(.+)/g;
        let videoPrefix = iframeSrc.replace(regex, "$1/");
        console.log('videoPrefix', videoPrefix);
        console.log('need to get the videos');
        allVideosEnhancedContentArr = await context.evaluate(async (allVideoEcSel, videoPrefix) => {
          let allVideoElms = document.querySelectorAll(allVideoEcSel);
          let allVideoArr = [];
          for(let i = 0; i < allVideoElms.length; i++) {
            let thisUrl = videoPrefix + allVideoElms[i].getAttribute('src');
            console.log(thisUrl);
            allVideoArr.push(thisUrl);
          }
          return allVideoArr;
        },
        allVideoEcSel,
        videoPrefix);
      }

      let response = await context.goto(thisProdPageUrl, { first_request_timeout: 60000, timeout: 30000, waitUntil: 'load', checkBlocked: true });
      console.log('going back to the prod page', response.status);
      
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  
    await applyScroll(context);

    async function addIFrameToMainPage() {
      const iframe = document.querySelector("#eky-dyson-iframe");
      if (iframe) {
        const src = iframe.src;
        if (src) {
          const res = await fetch(src);
          const html = await res.text();
          const parent = iframe.parentElement;
          parent.innerHTML = "";
          parent.innerHTML = html;
        }
      } else {
        console.log('we do not have the iframe - checkthe selector');
      }
    }
  await context.evaluate(addIFrameToMainPage);

  await new Promise((resolve, reject) => setTimeout(resolve, 4000));
  console.log('done scrolling');

  try {
    await context.waitForSelector('div[class*="flix-videodiv"] iframe', { timeout: 10000 });
    let videoLinks = await context.evaluate(async function() {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      let videoLinkElm = document.querySelectorAll('div[class*="flix-videodiv"] iframe');
      let videoLinksArr = [];
      if(videoLinkElm.length > 0) {
        for(let i = 0; i < videoLinkElm.length; i++) {
          if(videoLinkElm[i].hasAttribute('src')) {
            videoLinksArr.push(videoLinkElm[i].getAttribute('src'));
          } else if(videoLinkElm[i].hasAttribute('_src')) {
            videoLinksArr.push(videoLinkElm[i].getAttribute('_src'));
          } else {
            console.log('we do not have src for this iframe - ' + i);
          }
        }
      } else {
        console.log('we do not have the video iframe');
      }
      console.log('video links are - ' + videoLinksArr.join(' || '));
      addHiddenDiv('videolinks', videoLinksArr.join(' || '));
      return videoLinksArr.join(' || ');
    });
    console.log(videoLinks);
  } catch(err) {
    console.log('error while waiting for video - ', err.messsage);
  }

  if(allVideosEnhancedContentArr && (allVideosEnhancedContentArr.length > 0)) {
    console.log('outside context.evaluate',allVideosEnhancedContentArr.join(' | '));
    await context.evaluate(async (allVideoECText) => {
      async function addElementToDocumentAsync (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild(catElement);
      }
      console.log('inside evaluate', allVideoECText);
      await addElementToDocumentAsync('ecvideos', allVideoECText);
    }, 
    allVideosEnhancedContentArr.join(' | '));
  }
  

    return await context.extract(productDetails, { transform });
  },
};
