
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'argos.co.uk',
    timeout: 60000,
    country: 'UK',
    store: 'argos',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    try {
      // await context.waitForXPath('//div[@class="consent_prompt explicit_consent"]', { timeout: 5000 });
      await context.evaluateInFrame('iframe', () => {
        const closePopUp = document.querySelector('button#consent_prompt_submit');
        if (closePopUp) {
        // @ts-ignore
          closePopUp.click();
        }
      });
    } catch (error) {
      console.log('error: ', error);
    }
  },
};
