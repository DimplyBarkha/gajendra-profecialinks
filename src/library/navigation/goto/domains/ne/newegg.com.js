// const { parameterValues } = require("../am/amazon.com");

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'newegg.com',
    timeout: 45000,
    country: 'US',
    store: 'newegg',
    zipcode: '',
  },
 /* implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;

    //   const responseStatus = await context.goto(url, {
    //     firstRequestTimeout: 60000,
    //     timeout: 30000,
    //     waitUntil: 'load',
    //     checkBlocked: false,
    //     antiCaptchaOptions: {
    //       type: 'RECAPTCHA',
    //     },
    //   });
    //   console.log('status : ', responseStatus.status);
    //   console.log('URL : ', responseStatus.url);

    // const captchaFrame='iframe[title="recaptcha challenge"]';
    // // console.log(captchaFrame);
    //   const maxRetries = 3;
    //   let numberOfCaptchas = 0;

    //   try{
    //     await context.waitForSelector(captchaFrame);
    //   }catch(e){
    //     console.log('error:', e);
    //   }

    //   const checkExistance = async(selector) =>{
    //     return await context.evaluate(async (captchaSelector) => {
    //       return Boolean(document.querySelector(captchaSelector));
    //     }, selector);
    //   };
    //   const checkRedirection= async () =>{
    //     try {
    //       await context.waitForNavigation({ timeout });
    //       await context.waitForSelector('div.items-grid-view > div > div > a img', { timeout });
    //       console.log('Redirected to another page.');
    //       return true;
    //     } catch (e) {
    //       console.log('error: without undescore ', e);
    //       return false;
    //     }
    //   };

    //   let isCaptchaFramePresent = await checkExistance(captchaFrame);
    //   console.log("isCaptcha:"+ isCaptchaFramePresent);

    //   while (isCaptchaFramePresent && 0 < 3) {
    //     console.log('isCaptcha', true);
    //     ++numberOfCaptchas;
    //     await context.waitForNavigation({ timeout });
    //     try {
    //       console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
    //       await context.evaluateInFrame('iframe', () => grecaptcha.execute());  //could't run locally
    //       console.log('solved captcha, waiting for page change');
    //       await context.waitForNavigation({ timeout });
    //       const redirectionSuccess = await checkRedirection();

    //       if (redirectionSuccess) {
    //         await context.evaluate((url) => {
    //           window.location.href = url;
    //         }, url);
    //         await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
    //         break;
    //       } else {
    //         await context.evaluate((url) => {
    //           // eslint-disable-next-line no-unused-expressions
    //           window.location.reload;
    //         });
    //         await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
    //       }

    //       isCaptchaFramePresent = await checkExistance(captchaFrame);
    //     } catch (e) {
    //       console.log('error: without undescore ', e);
    //     }
    //   }

    //   isCaptchaFramePresent = await checkExistance(captchaFrame);

    //   if (isCaptchaFramePresent) {
    //     throw new Error('Failed to solve captcha');
    //   }

    //   const videoFrame = '#wcframable1-0';
    //       console.log(videoFrame);
    //         try{
    //           var link = await context.waitForSelector(videoFrame,{ timeout : 40000});
    //         }catch(e){
    //           console.log('error:', e);
    //         }

    // await context.waitForSelector('#wcframable1-0',{ timeout : 40000});
    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (document.getElementsByTagName('video')) {
        const vLink = parent.document.getElementById('wcframable1-0');
        if (vLink) {
          var videoLink = vLink.contentWindow.document.getElementsByTagName('video').vjs_video_1_html5_api;
          // var link = '';
          if (videoLink) {
            var link = videoLink.src;
          }
        }
      }
      const links = [];
      if (document.querySelector('div.wc-reset > ul > li > div > div > img.wc-media.wc-video')) {
        document.querySelectorAll('div.wc-reset > ul > li > div > div > img.wc-media.wc-video').forEach(e => {
          links.push(e.getAttribute('wcobj'));
        });
      }
      if (document.querySelector('div.wc-reset > ul > li > div > div > img.wc-media.wc-video')) addHiddenDiv('video', links.join(' | '));
      addHiddenDiv('video', link);

      //   const specification = [];
      //   if(document.querySelector('table.table-horizontal > tbody > tr')){
      //     document.querySelectorAll('table.table-horizontal > tbody > tr').forEach(e =>{
      //       specification.push(e.textContent);
      //   });
      //   }
      //   addHiddenDiv('specification',specification.join(' || '));

      //   const bulletInfo =
      //   (document.querySelector('div.product-bullets > ul') &&
      //     document.querySelector('div.product-bullets > ul').textContent
      //       .split(/[\n•]/)
      //       .join('||'));
      //   addHiddenDiv('bulletInfo', bulletInfo);
    });
  },
*/
};
