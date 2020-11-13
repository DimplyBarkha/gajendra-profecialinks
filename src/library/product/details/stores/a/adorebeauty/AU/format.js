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
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('width=120', 'width=600');
          item.text = item.text.replace('height=120', 'height=600');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('width=120', 'width=600');
          item.text = item.text.replace('height=120', 'height=600');
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.adorebeauty.com.au' + item.text;
        });
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: arrBullets.join(' || ') }];
        row.descriptionBullets = [{ text: arrBullets.length }];
      }
      if (row.description) {
        var arrDesc = [];
        row.description.forEach(item => {
          arrDesc.push(item.text);
        });
        row.description = [{ text: arrDesc.join(' ') }];
      }
      if (row.videos) {
        var arrVideos = [];
        var arrJsonVideo = JSON.parse(row.videos[0].text);
        arrJsonVideo.forEach(vdoUrl => {
          arrVideos.push(vdoUrl);
        });
        row.videos = [{ text: arrVideos }];
      }
      if (row.category) {
        row.category.splice(row.category.length - 1, 1);
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text.toUpperCase() === 'IN STOCK') {
            row.availabilityText = [{ text: 'In Stock' }];
          } else {
            row.availabilityText = [{ text: 'Out of Stock' }];
          }
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
