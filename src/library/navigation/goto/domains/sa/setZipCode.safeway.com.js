async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { zipcode } = inputs;
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
    await context.setInputValue('div [class*="fulfillment-content__search"] > input', `95401`);
    await context.evaluate(async() => {
        const searchButton = document.querySelector('div [class*="fulfillment-content__search"] > span');
        if (searchButton) {
            searchButton.click();
            console.log('able to click the button');
            await new Promise(resolve => { setTimeout(resolve, 15000); });
            const selectElementAll = document.querySelectorAll('div[class="card-store"]');
            const ourElement = [...selectElementAll].find((element) => element.innerText.includes('95401'));
            await new Promise(resolve => { setTimeout(resolve, 15000); });
            const selectButton = ourElement.querySelector('a[class*="card-store-btn"]');
            selectButton.click();
        }

        // const selectButton = document.querySelector('.in-store-content>.card-wrapper>.card-store:nth-child(1)>.row>div[class*="col-4"]>.caption>a');
        // if (selectButton) {
        //     selectButton.click();
        // }
        await new Promise(resolve => { setTimeout(resolve, 15000); });
    });
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