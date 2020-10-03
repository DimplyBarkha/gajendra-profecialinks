const transform = (data) => {
    const cleanUp = (data, context) => {
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
    var rank_count = 1;
    for (const { group } of data) {
        for (const row of group) {
            if (row.id) {
                row.id.forEach(item => {
                    var myRegexp = /de\/p\/(\d+\/)/g;
                    var match = myRegexp.exec(item.text);
                    if (match) {
                        if (match.length) {
                            match[1] = match[1].replace(/\//g, '');
                            item.text = match[1].trim();
                        } else {
                            delete row.id;
                        }
                        row.rankOrganic = [{ 'text': rank_count }];
                        row.rank = [{ 'text': rank_count }];
                    }
                    else {
                        delete row.id;
                    }
                });
                rank_count = rank_count + 1;
            }
            if (row.productUrl) {
                row.productUrl.forEach(item => {
                    item.text = 'https://www.melectronics.ch'.concat(item.text);
                });
            }
            if (row.aggregateRating2) {
                row.aggregateRating2.forEach(item => {
                    var myRegexp = /Keine/ig;
                    item.text = item.text.replace('.', ',').trim();
                    var match = myRegexp.exec(item.text);
                    if (match) {
                        delete row.aggregateRating2;
                    }
                    else {
                        item.text = item.text.replace(/\s*Sterne\s*/ig, '').trim();
                        item.text = item.text.replace(/\s*Stern\s*/ig, '').trim();
                    }
                });
            }
            if (row.name && row.brandText) {
                row.name.forEach(item => {
                    item.text = row.brandText[0].text.concat(' ', item.text);
                });
            }
            if (row.price) {
                row.price.forEach(item => {
                    item.text = item.text.replace(/\.–/g, '').trim();
                    item.text = item.text.replace(/\’/g, '').trim();
                    item.text = item.text.replace('.', ',').trim();
                    item.text = item.text.replace('/\,$/g', '').trim();
                });
            }
        }
    }
    return cleanUp(data);
};
module.exports = { transform }