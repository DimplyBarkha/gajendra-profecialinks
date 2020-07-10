
const implementation = async (inputs, parameters, context, dependencies,) => {
  console.log('hit zip changer!!')
  const { zipcode } = inputs;

  const changeZip = async (wantedZip) =>{
    await context.click('span#glow-ingress-line2.nav-line-2');
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.setInputValue('input[aria-label="or enter a US zip code"]',wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.click('input[aria-labelledby="GLUXZipUpdate-announce"]')
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.click('button[name="glowDoneButton"]')
  }

  try {
    await changeZip(zipcode);
  } catch (exception) {
    console.log('Failed to change zipcode..!')
  }

}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    // store: 'amazonApparel',
    store: 'amazonFresh',
    zipcode: '90210',
  },
  implementation
};
