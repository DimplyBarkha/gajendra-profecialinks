const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            try {
                if (row.price) {
                    row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
                }
                if (row.color) {
                    row.color = [{ text: row.color[0].text.substring(1) }];
                }
                if (row.firstVariant) {
                    row.firstVariant = [{ text: row.firstVariant[0].text.substring(1) }];
                }
                if (row.variantInformation) {
                    row.variantInformation = [{ text: row.variantInformation[0].text.substring(1) }];
                }
                if (row.packSize) {
                    row.packSize = [{ text: row.packSize[0].text.substring(1) }];
                }
                if (row.description) {
                    let text = '';
                    text = row.description[0].text.replace(/\n/g, '||');;
                    row.description = [{ text }];
                }


            } catch (exception) { console.log('Error in transform', exception); }
        }
    }
    return data;
};

module.exports = { transform };