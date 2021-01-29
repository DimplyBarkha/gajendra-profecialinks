module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'US',
        domain: 'drizly.com',
        store: 'drizly',
        zipcode: '',
    },

    implementation: async(inputs, parameterValues, context, dependencies) => {
        const storeId = inputs.Postcode;
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        await context.evaluate((storeId) => {
            const input = document.querySelector('#postalCode')
            input.setAttribute('value', storeId)
        }, storeId)
    },
};