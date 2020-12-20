const transform = (data) => {
    // Default transform function
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

    for (const { group }  of data) {
        for (const row of group) {
            if (row.sku) {
                row.sku.forEach(item => {
                    item.text = 'rewe_' + item.text.trim().split(' ')[1];
                });
            }
        }
    }

    for (const { group }  of data) {
        for (const row of group) {
            if (row.brandLink) {
                row.brandLink.forEach(item => {
                    item.text = 'https://shop.rewe.de' + item.text.trim();
                });
            }
        }
    }

    for (const { group }  of data) {
        for (const row of group) {
            if (row.shownImages) {
                row.shownImages.forEach(item => {
                    item.text = item.text.split('?')[0];
                });
            }
        }
    }

    for (const { group }  of data) {
        for (const row of group) {
            if (row.highQualityImages) {
                row.highQualityImages.forEach(item => {
                    item.text = item.text.split('?')[0];
                });
            }
        } 
    }

    return data;
};

module.exports = { transform };