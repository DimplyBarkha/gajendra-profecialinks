async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { zipcode } = inputs;
    await context.evaluate(async() => {
        const changeButton = document.querySelector('button[id="openFulfillmentModalButton"][class*="button"]');
        if (changeButton) {
            console.log('entered if block');
            changeButton.click();
            console.log('button clicked sucessfully');
            await new Promise(resolve => { setTimeout(resolve, 30000); });
        }
        console.log('sucessfully clicked the change button');
    });
    await context.setInputValue('input[aria-labelledby="zipcode"]', `${zipcode}`);
    await context.evaluate(async() => {
        const searchButton = document.querySelector('span[aria-label*="Zipcode"]');
        if (searchButton) {
            searchButton.click();
            console.log('able to click the button');
            await new Promise(resolve => { setTimeout(resolve, 30000); });
        }
        const selectButton = document.querySelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]');
        if (selectButton) {
            selectButton.click();
        }
        await new Promise(resolve => { setTimeout(resolve, 30000); });
    });
}
module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'US',
        domain: 'albertsons.com',
        store: 'albertsons',
        zipcode: '83642',
    },
    implementation,
};