/* eslint-disable no-inner-declarations */
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        let text = row.availabilityText[0].text;
        if (text === 'out of stock') {
          text = 'Out of Stock';
        } else {
          text = 'In Stock';
        }
        row.availabilityText = [{ text }];
      }
      if (row.manufacturerImages) {
        if (row.manufacturerImages.length > 1) {
          let text = '';
          row.manufacturerImages.forEach(item => {
            const contains1x1 = item.text.search('1x1.png');
            const containsThumb = item.text.search('thumb.jpg');
            const containsDigitW = item.text.search(' 200w');
            const containsPreview = item.text.search('preview.jpg');
            const containsGif = item.text.search('gif');
            if (contains1x1 === -1 && containsThumb === -1 && containsPreview === -1 && containsGif === -1) {
              if (containsDigitW !== -1) {
                item.text = item.text.match(/(.+)\s200w/)[1];
              }
              const splitResult = item.text.split('https:');
              const lengthOfSplit = splitResult.length;
              if (lengthOfSplit === 1) {
                item.text = 'https:' + splitResult[0];
              } else {
                item.text = 'https:' + splitResult[1];
              }
              text = text + (text ? ' | ' : '') + item.text;
            }
          });
          row.manufacturerImages = [{ text }];
        }
      }
      if (row.videos) {
        let text = '';
        row.videos.forEach(item => {
          if (item.text.search('undefined') !== -1) {
            text = '';
          } else {
            if (item.text.search('540p') !== -1) {
              item.text = item.text.replace('540p', '720p');
            } else if (item.text.search('640p') !== -1) {
              item.text = item.text.replace('640p', '720p');
            } else if (item.text.search('youtube.com') === -1) {
              if (item.text.search('"file"') !== -1) {
                // item.text = item.text.match(/"file":"(.+)","image"/)[1];
                // item.text = 'https:' + item.text.split('\\').join('');
                try {
                  const videos = JSON.parse(item.text).playlist;
                  let t = '';
                  videos.forEach(video => {
                    let url = video.file;
                    url = url.includes('https:') ? url : 'https:' + url;
                    t = t + (t ? ' | ' : '') + url;
                  });
                  item.text = t;
                } catch (e) {
                  console.log(e.message);
                }
              }
            }
            item.text = item.text.includes('https:') ? item.text : 'https:' + item.text;
            text = text + (text ? ' | ' : '') + item.text;
          }
        });
        const split = text.split(' | ');
        // @ts-ignore
        const uniqueVideos = [...new Set(split)];
        let text2 = '';
        uniqueVideos.forEach(video => {
          text2 = text2 + (text2 ? ' | ' : '') + video;
        });
        row.videos = [{ text: text2 }];
        row.galleryVideos = [{ text: text2 }];
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          item.text = item.text.replace(/(.+-)(\d+)(.html)/, '$2');
          text = text + (text ? ' | ' : '') + item.text;
        });
        const split = text.split(' | ');
        // @ts-ignore
        const uniqueIds = [...new Set(split)];
        let text2 = '';
        uniqueIds.forEach(id => {
          text2 = text2 + (text2 ? ' | ' : '') + id;
        });
        row.variants = [{ text: text2 }];
        row.variantCount = [{ text: uniqueIds.length }];
      } else {
        row.variantCount = [{ text: 0 }];
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.variantInformation = [{ text }];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        text = '|| ' + text;
        row.additionalDescBulletInfo = [{ text }];
      }
    }
  }

  const clean = (text) =>
    text
      .toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '" ')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
