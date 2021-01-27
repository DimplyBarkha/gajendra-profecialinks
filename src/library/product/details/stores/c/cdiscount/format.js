/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages.forEach(alternateImagesItem => {
          alternateImagesItem.text = alternateImagesItem.text.replace(/(.*)065x065(.*)/gm, '$1700x700$2');
        });
      }

      if (row.sku) {
        row.sku.forEach(skuItem => {
          skuItem.text = skuItem.text.toUpperCase();
        });
      }

      //   if (row.videos) {
      //     const allVideos = row.videos.map(videosItem => {
      //       if (videosItem.text.includes('VideoObject')) {
      //         return videosItem.text.replace(/url":"([^,]+)"/g, '$1');
      //       } else {
      //         return videosItem.text;
      //       }
      //     });
      //     row.videos = allVideos;
      //   }

      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(item => {
          text += ` ${item.text}`;
        });
        row.shippingInfo = [{ text: text.trim() }];
      }

      if (row.name) {
        row.nameExtended = [{ text: row.name[0].text }];
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }

      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }

      if (row.legalDisclaimer) {
        row.legalDisclaimer.forEach(item => {
          item.text = clean(item.text);
        });
      }

      const additionalDescBulletInfoArray = [];
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach((additionalDescBulletInfoItem) => {
          additionalDescBulletInfoItem.text = additionalDescBulletInfoItem.text.replace(/(^\w+)\s(.*)/g, '$1 : $2');
          additionalDescBulletInfoArray.push(additionalDescBulletInfoItem.text);
        });
      }
      row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArray.join(' || ') }];

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          if (item.xpath.includes('/li')) {
            text += `|| ${item.text.trim()} `;
          } else {
            text += `${item.text.trim()}`;
          }
        });
        // let text = '';
        // row.description.forEach(item => {
        //   text = row.description.map(elm => elm.text).join(' ').replace(/\n \n/g, ' ').replace(/\n/g, ' || ').replace(/●/g, '|| ');
        // });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.warnings) {
        clean(row.warnings);
      }
      if (row.directions) {
        clean(row.directions);
      }

      const specificationsArray = [];
      if (row.specifications) {
        row.specifications.forEach((specificationsItem) => {
          specificationsItem.text = specificationsItem.text.replace(/(\n\s*){1,}/g, ' : ');
          specificationsArray.push(specificationsItem.text);
        });
      }
      row.specifications = [{ text: specificationsArray.join(' || ') }];

      const shippingDimensionsArray = [];
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach((shippingDimensionsItem) => {
          shippingDimensionsItem.text = shippingDimensionsItem.text.replace(/(\n\s*){1,}/g, ' : ');
          shippingDimensionsArray.push(shippingDimensionsItem.text);
        });
      }
      row.shippingDimensions = [{ text: shippingDimensionsArray.join(' | ') }];

      if (row.weightGross) {
        row.weightGross.forEach((weightGrossItem) => {
          weightGrossItem.text = weightGrossItem.text.replace(/(\n\s*){1,}/g, ' : ');
        });
      }

      if (row.weightNet) {
        row.weightNet.forEach((weightNetItem) => {
          weightNetItem.text = weightNetItem.text.replace(/(\n\s*){1,}/g, ' : ');
        });
      }

      if (row.shippingWeight) {
        row.shippingWeight.forEach((shippingWeightItem) => {
          shippingWeightItem.text = shippingWeightItem.text.replace(/(\n\s*){1,}/g, ' : ');
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach((manufacturerImagesItem) => {
          if (!manufacturerImagesItem.text.toLowerCase().includes('http')) {
            manufacturerImagesItem.text = 'https:' + manufacturerImagesItem.text;
          }
        });
      }

      if (row.inTheBoxUrl1) {
        row.inTheBoxUrl = row.inTheBoxUrl1;
        delete row.inTheBoxUrl1
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }
    }
  }
  return data;
};
module.exports = { transform };
