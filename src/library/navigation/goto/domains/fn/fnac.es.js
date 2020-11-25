module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'fnac.es',
        timeout: 60000,
        country: 'ES',
        store: 'fnac',
        zipcode: '',
    },
    implementation: async({ url, zipcode, storeId },
        parameters,
        context,
        dependencies,
    ) => {
        const timeout = parameters.timeout ? parameters.timeout : 60000;
        //await context.setUseRelayProxy(false);

        const gotoPage = async() => {
            try {
                const responseStatus = await context.goto(url, {
                    antiCaptchaOptions: {
                        provider: '2-captcha',
                        type: 'GEETEST',
                    },
                    firstRequestTimeout: 60000,
                    timeout,
                    waitUntil: 'load',
                    checkBlocked: false,
                });

                console.log('NAVIGATED SOMEWHERE.');
                await new Promise(r => setTimeout(r, 4000));
                let checkcaptchaSelector = 'iframe[_src*="geo.captcha-delivery.com"],iframe[src*="geo.captcha-delivery.com"]';
                let getCaptcha = await checkExistance(checkcaptchaSelector);
                if (getCaptcha)
                    gotoPage();
                console.log('Status :', responseStatus.status);
                console.log('URL :', responseStatus.url);
            } catch (err) {
                console.log('Error navigating to page.');
                throw err;
            }
            await context.waitForNavigation({ timeout: 30000 });
        };

        const checkExistance = async(selector) => {
            return await context.evaluate(async(sel) => {
                return Boolean(document.querySelector(sel));
            }, selector);
        };

        const optionalWait = async(selector) => {
            try {
                await context.waitForSelector(selector, { timeout });
                console.log(`Found selector => ${selector}`);
                return true;
            } catch (err) {
                console.log('Couldn\'t load the selector ' + selector);
                return false;
            }
        };

        const delay = t => new Promise(resolve => setTimeout(resolve, t));

        await gotoPage();

        const captchaSelector = 'iframe[_src*="geo.captcha-delivery.com"],iframe[src*="geo.captcha-delivery.com"]';
        await optionalWait(captchaSelector);
        const isCaptchaFramePresent = await checkExistance(captchaSelector);

        console.log('isCaptcha', isCaptchaFramePresent);

        if (isCaptchaFramePresent) {
            try {
                const isHardBlocked = await context.evaluateInFrame(captchaSelector, function() {
                    return document.body.innerText.search('You have been blocked') > -1;
                });

                if (isHardBlocked) {
                    console.log('IP is hard blocked');
                    throw new Error('Blocked');
                }

                await context.evaluateInFrame(
                    captchaSelector,
                    function() {
                        // @ts-ignore
                        const code = geetest
                            .toString()
                            .replace(/appendTo\("#([^"]+)"\)/, 'appendTo(document.getElementById("$1"))');
                        return eval(`(${code})()`);
                    },
                );

                await delay(500);
                await new Promise(r => setTimeout(r, 4000));

                await context.evaluateInFrame(captchaSelector, function() {
                    // @ts-ignore
                    if (document.querySelector('div.geetest_radar_tip'))
                        document.querySelector('div.geetest_radar_tip').click();
                    if (document.querySelector('div.captcha-state-handler'))
                        document.querySelector('div.captcha-state-handler').click();
                });
                await new Promise(r => setTimeout(r, 6000));

                // Wait for iframe to disappear
                console.log("Check iframe exsists")
                let iframeStillExists = await checkExistance(captchaSelector);
                let counter = 0;
                while (iframeStillExists) {
                    iframeStillExists = await checkExistance(captchaSelector);
                    await delay(500);
                    console.log("iframe check")
                    console.log(counter)

                    ++counter;

                    // Waiting for a minute before throwing an error
                    if (counter === 120) {
                        throw new Error('CAPTCHA_FAIL');
                    }
                }

                console.log('Captcha Resolved.');
                await context.waitForNavigation({ timeout: 30000 });
                // we may be navigated to an index page after captcha solve
                const productPageSelector = 'h1.f-productHeader-Title';
                const isWaitProduct = await optionalWait(productPageSelector);

                console.log('isProduct', isWaitProduct);
                const cookieButtonSelector = 'body > div.optanon-alert-box-wrapper > div.optanon-alert-box-bg > div.optanon-alert-box-button-container > div.optanon-alert-box-button.optanon-button-allow > div > button';
                const cookieButton = await optionalWait(cookieButtonSelector);
                console.log('isCookie', cookieButton);

                if (cookieButton) {
                    try {
                        console.log('Clicking on cookie accept button.');
                        await context.click(cookieButtonSelector);
                    } catch (err) {
                        console.log('Error while accepting cookies.');
                    }
                }

                if (!isWaitProduct) {
                    await gotoPage();
                    const isCaptchaFramePresent = await checkExistance(captchaSelector);
                    console.log('SecondCaptchaFrame', isCaptchaFramePresent);
                    if (isCaptchaFramePresent) {
                        await gotoPage();
                        //throw new Error('got captcha a second time');
                    }
                }
            } catch (error) {
                console.log('CAPTCHA error: ', error);
                if (error.message === 'Blocked') {
                    await context.reportBlocked(403);
                    throw error;
                } else if (error.message === 'CAPTCHA_FAIL') {
                    throw error;
                }
            }
        } else {
            console.log('NO CAPTCHA ENCOUNTER');
        }

    },
};