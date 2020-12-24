
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            try {
                // if (row.price) {
                //     row.price[0].text = row.price[0].text.replace('.', ',')
                // }
                // if (row.listPrice) {
                //     row.listPrice[0].text = row.listPrice[0].text.replace('.', ',')
                // }

                // if (row.sku) {
                //     row.sku[0].text=row.sku[0].text.replace(/(.+)(sku":")(.+)(","brand)(.+)/g,'$3')
                // }
                if (row.nameExtended && row.quantity && row.color && row.brandText) {
                    let text = '';
                    if (row.nameExtended[0].text.includes(row.quantity[0].text)) {
                        text = `${row.brandText[0].text} ${row.nameExtended[0].text} ${row.color[0].text}`
                    } else {
                        text = `${row.brandText[0].text} ${row.nameExtended[0].text} ${row.color[0].text} ${row.quantity[0].text}`
                    }
                    row.nameExtended = [{ text: text.trim() }]
                }
                // if (row.mpc) {
                //     row.mpc[0].text = row.mpc[0].text.replace(/(.+)(mpn":")(.+)(","sku)(.+)/g, '$3')
                // }
                if (row.quantity) {
                    let text = '';
                    if (row.quantity[1]) {
                        text = row.quantity[1].text;
                    }
                    else {
                        text = row.quantity[0].text;
                    }
                    row.quantity = [{ text: text.trim() }]
                }

                // if (row.firstVariant) {
                //     var itemText = row.firstVariant[0].text.replace('sku: ', '');
                //     itemText = itemText.replace('"', '');
                //     itemText = itemText.replace('\'', '');
                //     row.firstVariant = [
                //         {
                //             text: itemText,
                //         },
                //     ];
                // }
                // if (row.variants) {
                //     let nextText = '';
                //     row.variants.forEach(item => {
                //         var itemText = item.text.replace('sku: ', '');
                //         itemText = itemText.replace('"', '');
                //         itemText = itemText.replace('\'', '');
                //         if (nextText.toString().indexOf(itemText) < 0) {
                //             nextText += itemText.trim() + '|';
                //         }
                //     });
                //     row.variants = [
                //         {
                //             text: nextText.substring(0, nextText.length - 1),
                //         },
                //     ];
                // }
                if (row.variants) {
                    let text = row.variants.map(element => element.text.trim()).join(' | ');
                    row.variants = [{ text }]
                }
            } catch (exception) {
                console.log('Error in transform', exception);
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
