module.exports = {
  implements: "navigation/goto",
  parameterValues: {
    domain: "londondrugs.com",
    timeout: 50000,
    country: "CA",
    store: "londondrugs",
    zipcode: "",
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.goto(url, {
      timeout: timeout,
      waitUntil: "load",
      checkBlocked: true,
    });

    let keyword = url.split("=")[3];
    keyword = keyword.toLowerCase();
    if (keyword == "dyson") {
      await context.click("#learnMoreBTN");
      await context.waitForFunction(
        () => {
          return document.querySelector(
            ".ld-sg-button.ld-sg-button--secondary.ld-sg-button--secondary-flex.js-load-more__btn.load-more__btn.hide"
          );
        },
        { timeout }
      );
    }

    const captchaFrame = 'iframe[_src*="https://geo.captcha"]';
    let captchaSelector = ".g-recaptcha";
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const result = await checkExistance(captchaSelector);
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log("isCaptcha", true);

      await context.solveCaptcha({
        type: "RECAPTCHA",
        inputElement: "#recaptcha-token",
        autoSubmit: true,
      });
      console.log("solved captcha, waiting for page change");
      await context.waitForNavigation({ timeout });
      console.log("Captcha vanished");
    }

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
