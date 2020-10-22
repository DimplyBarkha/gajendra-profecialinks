/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    console.log('RUNNING TRANSFORM.');
    for (const { group }
        of data) {
        for (const row of group) {
            if (row.specifications) {
                let text = '';
                row.specifications.forEach(item => {
                    text += `${item.text.replace(/\n \n/g, ':')} || `;
                });
                row.specifications = [{
                    text: text.slice(0, -4),
                }, ];
            }
            if (row.description || row.extraDescription) {
                const bonusDesc = row.extraDescription ? row.extraDescription.map(item => item.text).join(' ').split('From the Manufacturer')[0] : '';
                if (row.description) {
                    const text = row.description.map(item => item.text);
                    const formattedText = '|| ' + text.join(' || ').trim().replace(/\|\| \|/g, '|');
                    row.description = [{ text: formattedText + bonusDesc }];
                } else {
                    row.description = [{ text: bonusDesc }];
                }
            }

            if (row.manufacturerDescription) {
                let text = '';
                row.manufacturerDescription.forEach(item => {
                    text += `${item.text.replace(/\r\n|\r|\n/g, ' ')
              .replace(/&amp;nbsp;/g, ' ')
              .replace(/&amp;#160/g, ' ')
              .replace(/\u00A0/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .replace(/"\s{1,}/g, '"')
              .replace(/\s{1,}"/g, '"')
              .replace(/^ +| +$|( )+/g, ' ').trim()} `;
                });
                row.manufacturerDescription = [{
                    text: text.trim(),
                }, ];
            }

            if (row.otherSellersShipping2) {
                for (const item of row.otherSellersShipping2) {
                    if (item.text.toLowerCase().includes('free')) {
                        item.text = '0.00';
                    } else if (item.text.match(/\$([^\s]+)/)) {
                        item.text = item.text.match(/\$([^\s]+)/)[1];
                    }
                }
            }

            if (row.weightGross) {
                for (const item of row.weightGross) {
                    if (item.text.match(/.+\(/g)) {
                        item.text = item.text.replace('(', '').trim();
                    }
                }
            }

            if (row.otherSellersPrime) {
                for (const item of row.otherSellersPrime) {
                    if (item.text.includes('Details')) {
                        item.text = 'YES';
                    } else {
                        item.text = 'NO';
                    }
                }
            }

            if (row.videos) {
                for (const item of row.videos) {
                    if (item.text.includes('.hls.m3u8')) {
                        item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
                    }
                }
            }

            if (row.largeImageCount) {
                for (const item of row.largeImageCount) {
                    item.text = item.text.trim().match(/hiRes":"/g) ? item.text.trim().match(/hiRes":"/g).length : 0;
                }
            }

            if (row.brandText) {
                for (const item of row.brandText) {
                    if (item.text.match(/Visit the (.+)/g)) {
                        item.text = item.text.match(/Visit the (.+)/g)[0].replace('Visit the ', '').replace('Store', '');
                    }
                    if (item.text.match(/Brand: (.+)/g)) {
                        item.text = item.text.match(/Brand: (.+)/g)[0].replace('Brand: ', '');
                    }
                }
            }

            if (row.variantCount) {
                row.variantCount.forEach(item => {
                    if (item.text === '0') {
                        row.variantCount = [{
                            text: '1',
                        }, ];
                    }
                });
            }

            if (row.variantAsins) {
                let text = '';
                row.variantAsins.forEach(item => {
                    text += `${item.text} | `;
                });
                row.variantAsins = [{
                    text: text.slice(0, -3),
                }, ];
            }

            if (!row.listPrice && row.price) {
                row.listPrice = row.price;
            }

            if (!row.asin && row.sku) {
                row.asin = row.sku;
                delete row.sku;
            }
        }
    }
    return data;
};

module.exports = { transform };