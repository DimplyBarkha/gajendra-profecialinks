async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  //code for appending the storeId and Zipcode
  await context.evaluate(async (inputs) => {
    const locationElement = document.evaluate('//span[contains(text(),"Login")]/../preceding-sibling::div[1]', document).iterateNext();
    if (locationElement) {
      locationElement.click()
      await new Promise(res => setTimeout(res, 2000));
    }
    const zipcodeElement = document.evaluate('//h4[contains(text(),"Select your city to start shopping")]/following-sibling::div/span/span', document).iterateNext();
    if (zipcodeElement) {
      zipcodeElement.click();
      await new Promise(res => setTimeout(res, 2000));
    }
    const tryelement = document.querySelector('input[placeholder="Select your city"]');
    if (tryelement) {
      tryelement.click()
      await new Promise(res => setTimeout(res, 2000));
    }
    const allOptions = document.evaluate('//input[@placeholder="Select your city"]/following-sibling::div/ul/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let ourZipcode = null;
    for (let i = 0; i < allOptions.snapshotLength; i++) {
      let data = allOptions.snapshotItem(i).textContent;
      if (data === inputs.Postcode) {
        ourZipcode = allOptions.snapshotItem(i);
      }
    }
    if (ourZipcode != null) {
      ourZipcode.click();
      await new Promise(res => setTimeout(res, 2000));
    }
    const storeIdElement = document.evaluate('//input[contains(@placeholder,"Enter your area / apartment / pincode")]', document).iterateNext();
    if (storeIdElement) {
      storeIdElement.value = inputs.StoreID;
    }
    const countinueElement = document.evaluate('//button[contains(text(),"Continue")]', document).iterateNext();
    if (countinueElement) {
      countinueElement.click();
      await new Promise(res => setTimeout(res, 10000));
    }
  }, inputs)
  await context.evaluate((inputs) => {
    const zipcodeDiv = document.querySelector('div[id="price"]');
    zipcodeDiv.setAttribute('storeid', inputs.StoreID);
    zipcodeDiv.setAttribute('zipcode', inputs.Postcode);
    console.log('appended the zipinformation successfully');
  }, inputs)
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'IN',
    domain: 'bigbasket.com',
    store: 'bigbasket',
    zipcode: '',
  },
  implementation,
};
