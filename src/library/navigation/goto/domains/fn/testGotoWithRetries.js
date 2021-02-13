
const implementation = async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
) => {
    const timeout = parameters.timeout ? parameters.timeout : 120000;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36');

    const gotoFn = async (url) => {
        console.log('goto url: TEST ', url);
        const responseStatus = await context.goto(url, {
            antiCaptchaOptions: {
                provider: '2-captcha',
                type: 'GEETEST',
                autoSubmit: true,
            },
            firstRequestTimeout: 100000,
            timeout: timeout,
            waitUntil: 'load',
            checkBlocked: false,
        });

        const statusCode = responseStatus.status;
        console.log('Status :', statusCode);
        console.log('URL :', responseStatus.url);

        return { responseStatus, statusCode };
    };

    const checkExistance = async (selector) => {
        return await context.evaluate(async (captchaSelector) => {
            return Boolean(document.querySelector(captchaSelector));
        }, selector);
    };

    const captchStatus = async (cssCaptchaHandler) => {
        const status = await context.evaluateInFrame('iframe', (cssCaptchaHandler) => {
            const handler = document.querySelector(cssCaptchaHandler);
            if (!handler) return;

            return handler.getAttribute('captchastatus');
        }, cssCaptchaHandler);

        console.log('status: ', status);
        return status;
    };

    const isCaptchaSolved = async (cssCaptchaHandler) => {
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait until captch solver starts
        const maxTimeOut = 100000;
        let time = 0;
        let captchaStatus = await captchStatus(cssCaptchaHandler);
        while (captchaStatus === 'solving') {
            await new Promise(resolve => setTimeout(resolve, 500));
            time += 500;
            if (time >= maxTimeOut) {
                return false;
            };

            captchaStatus = await captchStatus(cssCaptchaHandler);
        }

        return captchaStatus !== 'fail';
        // if (captchaStatus == 'fail') {
        //     throw new Error('Captcha solver failed');
        // }
        // return true;
    };

    const solveCaptchIfNecessary = async ({ captchaFrame, cssCaptchaHandler }) => {
        const captchaExists = await checkExistance(captchaFrame);
        if (captchaExists) {
            console.log('isCaptchaFramePresent:', true);
            try {
                await new Promise(resolve => setTimeout(resolve, 3000));

                await context.evaluateInFrame('iframe', (cssCaptchaHandler) => {
                    const handler = document.querySelector(cssCaptchaHandler);
                    if (handler) {
                        console.log('Handler found, clicking it');
                        handler.click();
                    } else {
                        console.log('Handler not found');
                    }
                }, cssCaptchaHandler);
            } catch (e) {
                console.log('Something went wrong while solving captcha');
                console.log(e);
            }
        }

        return await isCaptchaSolved(cssCaptchaHandler);
        // if (!await isCaptchaSolved(cssCaptchaHandler)) {
        //     throw new Error('Captch not solved');
        // }
    };

    // const isHardBlocked = async (hardBlockedParam) => {
    //     return await context.evaluateInFrame('iframe', (hardBlockedParam) => {
    //       const { txtBlocked, cssBlockedTxtContainer } = hardBlockedParam;

    //       const container = document.querySelector(cssBlockedTxtContainer);
    //       const shownText = container && container.innerText.toLowerCase();

    //       // if on block, many possible text can be shown, we pass in an array
    //       if (shownText && Array.isArray(txtBlocked)) {
    //         return new RegExp(txtBlocked.join('|').toLowerCase()).test(shownText);
    //       }

    //       // if on block, single text is passed as string
    //       return shownText && shownText.includes(txtBlocked.toLowerCase());
    //     }, hardBlockedParam);
    //   };
    const isBlockedNoCaptcha = async () => {
        return await context.evaluateInFrame('iframe', () => {
            let title = document.querySelector('title');
            return (title && title.textContent.includes('been blocked'));
        })
    }

    const run = async () => {
        const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
        const cssCaptchaHandler = '.captcha-handler';
        const txtBlocked = ['You have been blocked', 'Vous avez été bloqué'];
        const cssBlockedTxtContainer = '.captcha__human__title';

        const cssCaptcha = { captchaFrame, cssCaptchaHandler };
        const hardBlockedParam = { txtBlocked, cssBlockedTxtContainer };
        let { statusCode } = await gotoFn(url);
        console.log('statusCode after initial goto: ' + statusCode + ', typeof statusCode: ' + typeof (statusCode))
        let maxRetries = 4;
        let currentAttempts = 0;
        let solved = (statusCode !== 403);

        while (currentAttempts < maxRetries && solved == false) {
            console.log(`starting loop, on attempt:${currentAttempts}`);
            currentAttempts++;

            if (statusCode === 403) {
                // waiting to load captcha
                await context.waitForSelector(captchaFrame, { timeout: 10000 }).catch(error => console.log(error));
                // await context.evaluate(()=>{
                //     debugger
                // })

                if (await isBlockedNoCaptcha()) {
                    statusCode = await gotoFn(url);
                };

                let currentTrySuccessful = await solveCaptchIfNecessary(cssCaptcha); // if not hard blocked
                if (currentTrySuccessful) {
                    solved = true;
                }

                await context.waitForNavigation({ timeout: 30000 }).catch(error => console.log(error))
                // sometimes after captcha solved, it gets hard blocked
                if (await isBlockedNoCaptcha()) {
                    statusCode = await gotoFn(url);
                };
            }

        }

        // add one more checkBlocked after loop

    };

    await run();
};

module.exports = { implementation }