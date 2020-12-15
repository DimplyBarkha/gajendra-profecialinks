async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { zipcode, storeId } = inputs;
    await context.evaluate(async() => {
        const changeButton = document.querySelector('div [class*="reserve-nav__instore"] > button');
        if (changeButton) {
            console.log('entered if block');
            changeButton.click();
            console.log('button clicked sucessfully');
            await new Promise(resolve => { setTimeout(resolve, 15000); });
        }
        console.log('sucessfully clicked the change button');
    });
    await context.setInputValue('div [class*="fulfillment-content__search"] > input', `${zipcode}`);
    await context.evaluate(async(storeId) => {
        const searchButton = document.querySelector('div [class*="fulfillment-content__search"] > span');
        if (searchButton) {
            searchButton.click();
            await new Promise(resolve => { setTimeout(resolve, 15000); });
            console.log('able to click the button');
        }
        if (storeId) {
            // const selectElementAll = document.querySelectorAll('div[class="card-store"] div[class="caption"]');
            // @ts-ignore
            // const ourElement = [...selectElementAll].find((element) => element.innerText.includes(storeId));
            // const selectButton = ourElement.querySelector('a[class*="card-store-btn"][role="button"]');
            // if (selectButton) {
            //     selectButton.click();
            // }
            console.log('Found store Id');
            await new Promise(resolve => { setTimeout(resolve, 5000); });
            const storeId1 = storeId + '';
            console.log('Found store Id');
            const xpath = `//p[contains(.,${storeId1})]/parent::div/parent::div/following-sibling::div//a[contains(@class,"card-store-btn")]`
            document.evaluate(xpath, document).iterateNext().click();
            console.log('Clicked on store');
        } else {
            const selectButton = document.querySelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]');
            if (selectButton) {
                selectButton.click();
            }
        }
        await new Promise(resolve => { setTimeout(resolve, 15000); });
    }, storeId)
    await context.evaluate((inputs) => {
        const zipcodeDiv = document.querySelector('picture>img');
        zipcodeDiv.setAttribute('storeid', inputs.storeId);
        zipcodeDiv.setAttribute('zipcode', inputs.zipcode);
        console.log('appended the zipinformation successfully');
    }, inputs)
}
module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'US',
        domain: 'safeway.com',
        store: 'safeway',
        zipcode: '',
    },
    implementation,
};