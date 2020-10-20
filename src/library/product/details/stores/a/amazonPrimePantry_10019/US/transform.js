/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
        let dataStr = JSON.stringify(data);
        dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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

        return JSON.parse(dataStr);
    };
    for (const { group }
        of data) {
        for (const row of group) {
            if (row.specifications) {
                let text = '';
                row.specifications.forEach(item => {
                    text += `${item.text.replace(/\n[\n\s]{0,4}/g, ' : ')} || `;
                });
                row.specifications = [{
                    text: text.slice(0, -4),
                }, ];
            }
            if (row.nameExtended) {
                let text = '';
                row.nameExtended.forEach(item => {
                    text += `${item.text.replace('Amazon.com:', '').replace(': Prime Pantry', '')}`;
                });
                row.nameExtended = [{
                    text: cleanUp(text),
                }, ];
            }
            if (row.description) {
                let text = '';
                row.description.forEach(item => {
                    text += ` || ${item.text.replace(/\n \n/g, ':')}`;
                });
                text = text.trim();
                let descriptionBottom = [];
                if (row.descriptionBottom) {
                    descriptionBottom = row.descriptionBottom;
                }
                descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
                row.description = [{
                    text: cleanUp(descriptionBottom.join(' | ')).replace(/\s*Satisfaction Guarantee.*/i, ''),
                }, ];
            }
            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                    item.text = `${item.text.replace(',', '')}`;
                });
            }
            if (row.variantCount) {
                row.variantCount.forEach(item => {
                    item.text = item.text === '0' ? '1' : item.text;
                });
            }
            if (row.manufacturerDescription) {
                let text = '';
                row.manufacturerDescription.forEach(item => {
                    text += item.text.replace(/\n \n/g, ' ');
                });
                row.manufacturerDescription = [{
                    text: cleanUp(text.replace(/<img.{1,300}">/g, '')),
                }, ];
            }
            if (row.promotion) {
                row.promotion.forEach(item => {
                    item.text = cleanUp(item.text);
                });
            }
            row.alternateImages && row.alternateImages.splice(0, 1);

        }
    }
    return data;
};
module.exports = { transform };