
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazon',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const MAX_CAPTCHAS = 3;
    let captchas = 0;
    let lastResponseData;
    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate("//img[contains(@src,'/captcha/')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (captchaEl.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };
    const solveCaptcha = async () => {
      console.log('isCaptcha', true);
      await context.solveCaptcha({
        type: 'IMAGECAPTCHA',
        inputElement: 'form input[type=text][name]',
        imageElement: 'form img',
        autoSubmit: true,
      });
      const [response] = await Promise.all([
        console.log('solved captcha, waiting for page change'),
        context.waitForNavigation(),
        await new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
      console.log('Captcha vanished');
    };
    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA', await isCaptcha());
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha', await isCaptcha(), captchas);
        await solveCaptcha();
      }
      if (await isCaptcha() === 'true') {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return 'false';
      }
      return 'true';
    };
    const analyzePage = async () => {
      let status = 200;
      if (document.querySelector('a img[src*="503.png"], a[href*="ref=cs_503_link"]')) {
        status = 503;
      } else if (document.evaluate("//script[contains(text(),'PageNotFound')]", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength > 0 || !!document.querySelector('a[href*="dogsofamazon"],img[alt*="unde"],img[alt*="Dogs"],img[alt*="hein"]') ) {
        status = 404;
      }
      return { status };
    };
    const handlePage = async (lastResponseData) => {
      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        return true;
      }
      if (lastResponseData.status === 503) {
        const [response] = await Promise.all([
          console.log('Waiting for page to reload on homepage'),
          context.waitForNavigation(),
          console.log('Clicking 503 image'),
          await context.click('a img[src*="503.png"], a[href*="ref=cs_503_link"]'),
        ]);
        if (await solveCaptchaIfNecessary() === 'false') {
          return { status: false };
        }
        console.log('Go to some random page');
        const clickedOK = await context.evaluate(async function () {
          const randomLinkEls = document.evaluate('//a[@href]', document, null, XPathResult.ANY_TYPE, null);
          const randomLinkEl = randomLinkEls.iterateNext();
          if (randomLinkEl) {
            // @ts-ignore
            randomLinkEl.click();
            return 'true';
          } else {
            return 'false';
          }
        });
        if (clickedOK === 'false') {
          console.log('Could not click a product, aborting... :/');
          return { status: false };
        } else {
          context.waitForNavigation();
        }
        console.log('Going back to desired page');
        lastResponseData = await context.goto(url, {
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: false,
          js_enabled: true,
          css_enabled: false,
          random_move_mouse: true,
        });
        console.log('lastResponseData', lastResponseData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (await solveCaptchaIfNecessary() === 'false') {
          return { status: false };
        }
        return lastResponseData;
      }
    };
    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await context.goto(url, {
        timeout: 10000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      if ([200, 503, 410, 404].indexOf(lastResponseData.status) === -1) {
        console.log('Blocked: ' + lastResponseData.status);
        if (benchmark) {
          return;
        }
        if (backconnect) {
          throw Error('Bad response code: ' + lastResponseData.code);
        }
        return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      }
      if (await solveCaptchaIfNecessary() === 'false') {
        return;
      }
      let pageStatus = await context.evaluate(analyzePage);
      pageStatus = await handlePage(pageStatus);
      if (pageStatus && pageStatus.status && pageStatus.status !== 200) {
        pageStatus = await handlePage(pageStatus);
      }
      // Return for false status.
      if (pageStatus && !pageStatus.status) {
        return;
      }
      // Check if page still blocked after sencond try.
      if (pageStatus && pageStatus.status === 503) {
        return context.reportBlocked('Blocked: 503 error.');
      }
      const wrongLocale = await context.evaluate(async function () {
        const locationWarningPopupEl = document.evaluate("//div[contains(@id, 'glow-toaster-body') and not(//*[contains(text(), 'Amazon Fresh')])]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (locationWarningPopupEl.snapshotLength > 0) {
          return 'true';
        } else {
          return 'false';
        }
      });
      if (await wrongLocale === 'true' && !benchmark) {
        console.log('wrongLocale', !benchmark, wrongLocale);
        console.log('Incorrect locale detected');
        if (backconnect) {
          throw new Error('Incorrect locale detected');
        }
        throw new Error('Incorrect locale detected');
      }
    };
    await run();
  },
  // implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
  //   const memory = {};
  //   const backconnect = !!memory.backconnect;
  //   console.log('backconnect', backconnect);
  //   const benchmark = !!memory.benchmark;
  //   console.log('benchmark', benchmark);
  //   const start = Date.now();
  //   const MAX_CAPTCHAS = 3;

  //   // let pageId;
  //   let captchas = 0;
  //   let hasCaptcha = false;
  //   let lastResponseData;
  //   // eslint-disable-next-line
  //   // const js_enabled = true; // Math.random() > 0.7;
  //   // console.log('js_enabled', js_enabled); ;

  //   const isCaptcha = async () => {
  //     return await context.evaluate(async function () {
  //       const captchaEl = document.evaluate("//img[contains(@src,'/captcha/')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //       if (captchaEl.snapshotLength) {
  //         return 'true';
  //       } else {
  //         return 'false';
  //       }
  //     });
  //   };

  //   const solveCaptcha = async () => {
  //     console.log('isCaptcha', true);

  //     await context.solveCaptcha({
  //       type: 'IMAGECAPTCHA',
  //       inputElement: 'form input[type=text][name]',
  //       imageElement: 'form img',
  //       autoSubmit: true,
  //     });
  //     console.log('solved captcha, waiting for page change');
  //     context.waitForNavigation();
  //     console.log('Captcha vanished');
  //   };

  //   const solveCaptchaIfNecessary = async () => {
  //     console.log('Checking for CAPTCHA');
  //     while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
  //       captchas++;
  //       if (backconnect) {
  //         throw Error('CAPTCHA received');
  //       }
  //       console.log('Solving a captcha', await isCaptcha(), captchas);
  //       await solveCaptcha();
  //     }
  //     if (await isCaptcha() === 'true') {
  //       if (!benchmark) {
  //         // we failed to solve the CAPTCHA
  //         console.log('We failed to solve the CAPTCHA');
  //         return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
  //       }
  //       return 'false';
  //     }
  //     return 'true';
  //   };
  //   const run = async () => {
  //     // do we perhaps want to go to the homepage for amazon first?
  //     lastResponseData = await context.goto(url, {
  //       timeout: 60000,
  //       waitUntil: 'load',
  //       checkBlocked: true,
  //       js_enabled: true,
  //       css_enabled: false,
  //       random_move_mouse: true,
  //     });

  //     if (lastResponseData.status === 404 || lastResponseData.status === 410) {
  //       return;
  //     }

  //     if (lastResponseData.status === 503) {
  //       console.log('Clicking 503 image');
  //       await context.click('a img[src*="503.png"], a[href*="ref=cs_503_link"]');

  //       console.log('Waiting for page to reload on homepage');
  //       context.waitForNavigation();
  //       if (await solveCaptchaIfNecessary() === 'false') {
  //         hasCaptcha = true;
  //         return;
  //       }

  //       console.log('Go to some random page');
  //       const clickedOK = await context.evaluate(async function () { //* [contains(@id,'contextualIngressPtLabel_deliveryShortLine')]/spa
  //         const randomLinkEls = document.evaluate("a[href*='/dp/']", document, null, XPathResult.ANY_TYPE, null);
  //         const randomLinkEl = randomLinkEls.iterateNext();
  //         if (randomLinkEl) {
  //           // @ts-ignore
  //           randomLinkEl.click();
  //           return 'true';
  //         } else {
  //           return 'false';
  //         }
  //       });

  //       if (clickedOK === 'false') {
  //         console.log('Could not click a product, aborting... :/');
  //         return;
  //       } else {
  //         context.waitForNavigation();
  //       }

  //       console.log('Going back to desired page');
  //       lastResponseData = await context.goto(url, {
  //         timeout: 60000,
  //         waitUntil: 'load',
  //         checkBlocked: true,
  //         js_enabled: true,
  //         css_enabled: false,
  //         random_move_mouse: true,
  //       });
  //       console.log('lastResponseData', lastResponseData);
  //     }

  //     if (lastResponseData.status === 404 || lastResponseData.status === 410) {
  //       return;
  //     }

  //     if (lastResponseData.status !== 200) {
  //       console.log('Blocked: ' + lastResponseData.status);
  //       if (benchmark) {
  //         return;
  //       }
  //       if (backconnect) {
  //         throw Error('Bad response code: ' + lastResponseData.code);
  //       }
  //       return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
  //     }

  //     if (await solveCaptchaIfNecessary() === 'false') {
  //       hasCaptcha = true;
  //       return;
  //     }

  //     if (lastResponseData.status === 404 || lastResponseData.status === 410) {
  //       return;
  //     }

  //     const wrongLocale = await context.evaluate(async function () {
  //       const localeEl = document.evaluate("//div[contains(@id, 'glow-toaster-body') and not(//*[contains(text(), 'Amazon Fresh')])]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //       if (localeEl.snapshotLength > 0) {
  //         return 'true';
  //       } else {
  //         return 'false';
  //       }
  //     });

  //     if (wrongLocale === 'true' && !benchmark) {
  //       console.log('wrongLocale', !benchmark, wrongLocale);
  //       console.log('Incorrect locale detected');
  //       if (backconnect) {
  //         throw new Error('Incorrect locale detected');
  //       }
  //       throw new Error('Incorrect locale detected');
  //       // return extractorContext.raiseError('WRONG_GEO', 'Incorrect locale detected');
  //     }
  //   };
  //   try {
  //     await run();
  //   } finally {
  //   // needs to be non-fat arrow
  //     await context.evaluate((captchaCount, duration, js, hasCaptcha) => {
  //       const captchasElt = document.createElement('meta');
  //       captchasElt.name = 'captchas';
  //       captchasElt.content = captchaCount;
  //       document.head.appendChild(captchasElt);
  //       const hasCaptchaElt = document.createElement('meta');
  //       hasCaptchaElt.name = 'hasCaptcha';
  //       hasCaptchaElt.content = hasCaptcha;
  //       document.head.appendChild(hasCaptchaElt);
  //       const timeElt = document.createElement('meta');
  //       timeElt.name = 'durationmillis';
  //       timeElt.content = duration;
  //       document.head.appendChild(timeElt);
  //       const javascriptElt = document.createElement('meta');
  //       javascriptElt.name = 'javascript';
  //       javascriptElt.content = js;
  //       document.head.appendChild(javascriptElt);
  //       // js_enabled
  //     }, [captchas, Date.now() - start, hasCaptcha]);
  //   }
  //   console.log(zipcode);
  //   if (zipcode) {
  //     await dependencies.setZipCode({ url, zipcode });
  //   }
  // },
};
