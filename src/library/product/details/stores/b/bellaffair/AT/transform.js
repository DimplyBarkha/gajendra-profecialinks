const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            try {
                if (row.price) {
                    row.price = [{ text: row.price[0].text.substring(1).trim() }, { text: row.price[0].text.charAt(0) }];
                }

                if (row.listPrice) {
                    row.listPrice = [{ text: row.listPrice[0].text.substring(1).trim() }, { text: row.listPrice[0].text.charAt(0) }];
                }

                if (row.color) {
                    row.color = [{ text: row.color[0].text.substring(1) }];
                }
                if (row.packSize) {
                    row.packSize = [{ text: row.packSize[0].text.substring(1) }];
                }
                if (row.description) {
                    let text = '';
                    text = row.description[0].text.replace(/\n/g, ' || ');;
                    row.description = [{ text }];
                }
                if (row.specifications) {
                    let text = '';
                    row.specifications.forEach(item => {
                        text = text + (text ? ' | ' : '') + item.text;
                      });
                      row.specifications = [{ text }];
                }
                if (row.variants) {
                    let text = '';
                    row.variants.forEach(item => {
                        text += `${item.text} | `;
                    });
                    row.variants = [
                        {
                            text: text.slice(0, -3).trim(),
                        },
                    ];
                }

                if (row.additionalDescBulletInfo) {

                    let text = '';
                    row.additionalDescBulletInfo.forEach(item => {
                        text += `${item.text} || `;
                    });
                    row.additionalDescBulletInfo = [
                        {
                            text: text.slice(0, -3).trim(),
                        },
                    ];
                }
                if (row.name && row.brandText) {
                    let text = '';
                    let brandName = row.brandText[0].text.replace(' / ', ' ').replace(/\s\s+/g, ' ').trim();
                    text = row.name[0].text.replace(brandName, '').trim();
                    row.name = [{ text }];
                }
                if (row.promotion) {
                    let text = '';
                    text = row.promotion[0].text.replace(/\n/g, ' ');;
                    row.promotion = [{ text }];
                }
                if (row.quantity) {
                    let quantityArr = row.quantity[0].text.split('/');

                    if (quantityArr[1]) {
                        row.quantity[0].text = quantityArr[1].replace(')', '').trim();
                    }
                }
                if (row.aggregateRating) {

                    row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
                }
                if (row.subCategory) {

                    let text = '';
                    row.subCategory.forEach(item => {
                        text += `${item.text} > `;
                    });
                    row.subCategory = [
                        {
                            text: text.slice(0, -2).trim(),
                        },
                    ];
                }
            } catch (exception) { console.log('Error in transform', exception); }
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