
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const sku = (row.variantId[0] && row.variantId[0].text) || (row.sku[0] && row.sku[0].text);
        const text = row.description[0].text.replace(/skuId[^<]+/, `skuId : ${sku}`).replace(/<li>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim();
        row.description = [{ text }];
      }

      if (row.additionalDescBulletInfo) {
        const sku = (row.variantId[0] && row.variantId[0].text) || (row.sku[0] && row.sku[0].text);
        const index = row.additionalDescBulletInfo.indexOf(elm => elm.text.incldues('skuId : '));
        if (index !== -1) {
          row.additionalDescBulletInfo[index].text = `skuId : ${sku}`;
        }
      }

      if (row.specifications && row.specifications.length) {
        const text = Object.keys(row.specifications).map(spec => {
          return `${spec} : ${row.specifications[spec]}`;
        }).join(' | ');
        row.specifications = [{ text }];
      }

      if (row.mpc && row.mpc[0].text.includes('Model')) {
        let text;
        if (row.mpc[0].text.match(/^Model[\s:][^,;:]+$/)) {
          text = row.mpc[0].text.match(/^Model[\s:]([^,;:]+)$/)[1];
        } else {
          const color = row.color[0] && row.color[0].text.toLowerCase();
          const color2 = row.color[0] && row.color[0].text.toLowerCase().replace(/\//g, '|');
          const colorGroup = row.colorGroup[0] && row.colorGroup[0].text.toLowerCase();
          const regex = new RegExp('([^\\s]+) ' + `(?=[(]*(${colorGroup}|${color}|${color2})[(]*)`);
          text = row.mpc[0].text.toLowerCase().match(regex)[1].trim();
        }
        row.mpc = [{ text }];
      }

      if (row.manufacturerImages) {
        const manufacturerImages = row.manufacturerImages.map(elm => ({ text: elm.text.replace('.w480.jpg', '') }));
        row.manufacturerImages = manufacturerImages;
        const videos = manufacturerImages.filter(elm => elm.text.includes('.mp4')).map(elm => {
          const video = elm.text.match(/^.+(?=.mp4)/) && elm.text.match(/^.+(?=.mp4)/)[0] + '.mp4';
          if (video) {
            return { text: video };
          }
        });

        if (row.videos) {
          row.videos = row.videos.concat(videos);
        } else {
          row.videos = videos;
        }
      }

      row.imageAlt = [{ text: row.nameExtended[0].text + '. View a larger version of this product image.' }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
