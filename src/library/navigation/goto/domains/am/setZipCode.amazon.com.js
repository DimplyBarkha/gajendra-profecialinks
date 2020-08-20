
const implementation = async (inputs, parameters, context, dependencies) => {
  console.log('hit zip changer!!');
  const { zipcode } = inputs;

  const changeZip = async (wantedZip) => {
    // await context.click('a.a-popover-trigger div#nav-packard-glow-loc-icon');
    await context.click('span#glow-ingress-line2.nav-line-2');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.setInputValue('input[aria-label="or enter a US zip code"]', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.click('input[aria-labelledby="GLUXZipUpdate-announce"]');
    // if 'input[aria-labelledby="GLUXZipUpdate-announce"]' is not clicked, then using manual click
    await context.evaluate(async function () {
      if (document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]')) {
        document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]').click();
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    // After clicking apply, check if error msg is present
    await context.evaluate(() => {
      const errorMsg = document.querySelector('#GLUXZipError[style="display: inline;"]');
      if (errorMsg) {
        throw new Error('Site claiming zip code is invalid');
      }
    });

    await context.click('button[name="glowDoneButton"]');
  };

  try {
    await changeZip(zipcode);
    // await changeZip(zipcode);
    // await context.waitForXPath('//div[@id="nav-global-location-slot"]//*[contains(text(), "' + zipcode + '")]');
  } catch (exception) {
    console.log(exception);
    await changeZip(zipcode);
    // await context.waitForXPath('//div[@id="nav-global-location-slot"]//*[contains(text(), "' + zipcode + '")]');
    // throw new Error('Failed to update zipcode!');
  }
};

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazonFresh',
    zipcode: '90210',
  },
  implementation,
};
