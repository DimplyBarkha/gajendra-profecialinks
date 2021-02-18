
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            try {
                if (row.price) {
                    row.price[0].text = row.price[0].text.replace('.', ',');
                }
                if (row.listPrice) {
                    row.listPrice[0].text = row.listPrice[0].text.split(' ')[1].replace('.', ',');
                }
                if (row.nameExtended) {
                    var nameExtended = row.nameExtended[0].text;
                    if (row.brandText) {
                        var brand = nameExtended.includes(row.brandText[0].text);
                        if (!brand) {
                            row.nameExtended[0].text = row.brandText[0].text + ' ' + nameExtended;
                        }
                    }
                }
            } catch (exception) {
                console.log('Error in transform', exception);
            }
            if(row.manufacturerImages){

            }
        }
    }

    // Clean up data
    const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));

    return data;
};

module.exports = { transform };
