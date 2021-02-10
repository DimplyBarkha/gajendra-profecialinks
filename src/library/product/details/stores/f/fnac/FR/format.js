/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/'\s{1,}/g, '"')
    .replace(/\s{1,}'/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRatingItem => {
          aggregateRatingItem.text = aggregateRatingItem.text.replace('/', '.');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      // if (row.name && row.brandText) {
      //   row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
      // }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          // item.text = item.text.replace(/^(\d+)(.*?)(\d+)/, '$2$1,$3');
          item.text = item.text.replace('€', ',');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          // item.text = item.text.replace(/^(\d+)(.*?)(\d+)/, '$2$1,$3');
          item.text = item.text.replace('€', ',');
        });
      }
      if (row.description) {
        row.description.forEach(descriptionItem => {
          descriptionItem.text = cleanUp(descriptionItem.text);
        });
      }
      if (row.additionalDescBulletInfo && Array.isArray(row.additionalDescBulletInfo) && (row.additionalDescBulletInfo.length > 0)) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/(\n\s*){1,}/g, ' || ');
        row.additionalDescBulletInfo[0].text = cleanUp(row.additionalDescBulletInfo[0].text);
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityTextItem => {
          if (availabilityTextItem.text.toLowerCase().includes('en stock')) {
            availabilityTextItem.text = 'In Stock';
          } else {
            availabilityTextItem.text = 'Out Of Stock';
          }
        });
      }
      if (row.descriptionBullets) {
        row.descriptionBullets.forEach((descriptionBulletsItem) => {
          if (
            descriptionBulletsItem.text === 0 ||
            descriptionBulletsItem.text === '0'
          ) {
            descriptionBulletsItem.text = '';
          }
        });
      }
      if (row.manufacturerDescription) {
        var arrTemp = [];
        row.manufacturerDescription.forEach(item => {
          arrTemp.push(item.text);
        });
        row.manufacturerDescription = [{ text: arrTemp.join(' ') }];
      }
      if (row.description2) {
        if (row.description && Array.isArray(row.description) && (row.description.length > 0)) {
          row.description = [{ text: row.description[0].text + ' || ' + row.description2[0].text }];
        }
        delete row.description2;
      }
      if (row.productOtherInformation) {
        var arrInfo = [];
        row.productOtherInformation.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n/, ' : ');
          item.text = item.text.replace(/\n\s*\n/, ' : ');
          arrInfo.push(item.text);
        });
        row.productOtherInformation = [{ text: arrInfo.join(' | ') }];
      }
      if (row.imageAlt) {
        var arrImgs = [];
        row.imageAlt.forEach(item => {
          if (arrImgs.includes(item.text)) {
            arrImgs.push(item.text);
          }
        });
        if (arrImgs.length) {
          row.imageAlt = [{ text: arrImgs.join(' | ') }];
          row.secondaryImageTotal = [{ text: arrImgs.length }];
        }
      }
      if (row.videos) {
        var arrVideo = [];
        row.videos.forEach(item => {
          arrVideo.push(item.text);
        });
        row.videos = [{ text: arrVideo.join(' | ') }];
      }
      if (row.videos2) {
        var arrV2 = [];
        row.videos2.forEach(item => {
          arrV2.push(item.text);
        });
        row.videos2 = [{ text: arrV2.join(' | ') }];
        if(row.videos && (row.videos.length > 0) && row.videos2 && (row.videos2.length > 0)) {
          row.videos = [{ text: row.videos[0].text + ' | ' + row.videos2[0].text }];
        }
        
        delete row.videos2;
      }
      if (row.manufacturerImages) {
        var arrImg = [];
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('http')) {
            item.text = 'https:' + item.text;
          }
          arrImg.push(item.text);
        });
        row.manufacturerImages = [{ text: arrImg.join(' | ') }];
      }
      if (row.warranty) {
        row.warranty.forEach(warrantyItem => {
          warrantyItem.text = warrantyItem.text.replace('Garantie', '').trim();
        });
      }
      if (row.specifications && Array.isArray(row.specifications) && (row.specifications.length > 0)) {
        row.specifications[0].text = cleanUp(row.specifications[0].text
          .replace(/(\n\s*){4,}/g, ' || ')
          .replace(/(\n\s*){2,}/g, ' : '));
      }
      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach((element) => {
          if (element.text && element.text.includes(',')) {
            const isMatchingText = element.text.split(',')[0].match(/(.+)(jpg)/g);
            const text = isMatchingText ? isMatchingText[0] : element.text;
            const finalText = `https:${text}`;
            element.text = finalText;
          }
        });
      }
      if (row.unInterruptedPDP) {
        const pdp = Array.from(new Set(row.unInterruptedPDP.map(elm => elm.text.trim())));
        row.unInterruptedPDP = pdp.map(text => ({ text }));
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = cleanUp(el.text);
  }))));
  return data;
};
module.exports = { transform };
