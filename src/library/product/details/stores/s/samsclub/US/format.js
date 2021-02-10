
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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
    for (const { group } of data) {
        for (const row of group) {
            if (row.alternateImages) {
                row.alternateImages.forEach(item => {
                    if (item.text.includes("?")) {
                        let split1 = item.text.split("?");
                        item.text = `${split1[0]}`;
                    }

                });
            }

            if (row.image) {
                row.image.forEach(item => {
                    if (item.text.includes("?")) {
                        let split1 = item.text.split("?");
                        item.text = `${split1[0]}`;
                    }

                });
            }
            if (row.manufacturerDescription) {
                let desc = '';
                row.manufacturerDescription.forEach(item => {
                    desc += `${item.text}`;
                });
                row.manufacturerDescription = [
                    {
                        text: desc
                    },
                ];
            }
            if (row.gtin) {
                row.gtin.forEach(item => {
                    if (item.text.includes('/')) {
                        let split1 = item.text.split('/');
                        console.log("item.text",item.text);
                        item.text = split1[split1.length - 1]
                        item.text = item.text.slice('_A','').trim();
                    }
                });

            }
            if (row.availabilityText) {
                row.availabilityText.forEach(item => {
                    console.log("checked",item.text);
                    if (item.text === 'InStock') {
                        console.log("item.text",item.text);
                        item.text = 'In Stock';
                    }
                    else{
                        console.log("item.text",item.text);
                        item.text = 'Out of stock';
                    }
                });

            }
        }
    }
    return cleanUp(data);
};

module.exports = { transform };
