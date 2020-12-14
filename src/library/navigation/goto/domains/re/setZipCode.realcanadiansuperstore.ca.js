module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'CA',
        domain: 'realcanadiansuperstore.ca',
        store: 'Realcanadiansuperstore',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        if (inputs.storeId) {
            console.log(inputs.storeId);
        }
    }

};