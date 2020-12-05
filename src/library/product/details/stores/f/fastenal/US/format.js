/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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

    for (const { group }
        of data) {
        for (const row of group) {
            if (row.image) {
                row.image.forEach(item => {
                    item.text = "https:" +item.text;
                });
              }
              if (row.Image360Present) {
                row.Image360Present.forEach(item => {
                    item.text = "https:" +item.text;
                });
              }

              if (row.imageZoomFeaturePresent) {
                row.imageZoomFeaturePresent.forEach(item => {
                    item.text = "https:" +item.text;
                });
              }

              if (row.sku) {
                row.sku.forEach(item => {
                    item.text = "fastenal_" +item.text;
                });
              }
              if (row.Price) {
                row.Price.forEach(item => {
                  item.text = item.text.replace('/ each', ' ').trim();
                  item.text = item.text.replace('$', ' ').trim();
                });
              }

              if (row.listPrice) {
                row.listPrice.forEach(item => {
                  item.text = item.text.replace('/ each', ' ').trim();
                  item.text = item.text.replace('$', ' ').trim();
                });
              }


        }
    }
    return data;
};

module.exports = { transform };