
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.nameExtended) {
				let newText = '';
				row.nameExtended.forEach(item => {
					newText = item.text;
				});
				row.nameExtended = [{ text: newText }];
			}
			if (row.additionalDescBulletInfo) {
				let newText = '';
				row.additionalDescBulletInfo.forEach(item => {
					newText = item.text;
				});
				row.additionalDescBulletInfo = [{ text: newText }];
			}
			if (row.variants) {
				let newText = [];
				row.variants.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.variants = [{ text: newText.join(" | ") }];
			}
			if (row.sku) {
				let newText = [];
				row.sku.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.sku = [{ text: newText }];
			}
			if (row.variantId) {
				let newText = [];
				row.variantId.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.variantId = [{ text: newText }];
			}
			if (row.mpc) {
				let newText = [];
				row.mpc.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.mpc = [{ text: newText }];
			}
			if (row.firstVariant) {
				let newText = [];
				row.firstVariant.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.firstVariant = [{ text: newText }];
			}
			if (row.warranty) {
				let newText = [];
				row.warranty.forEach(item => {
					newText.push(item.text.replace("Geräte-Garantie ", ""))
				});
				row.warranty = [{ text: newText }];
			}
			if (row.price) {
				let newText = '';
				row.price.forEach(item => {
					newText = item.text.replace(" *", "")
				});
				row.price = [{ text: newText }];
			}
			if (row.aggregateRating) {
				let newText = 0;
				row.aggregateRating.forEach(item => {
					let data = item.text.split("/");
					newText = Number(data[0])
					if (Number(data[1]) === 1) {
						newText = newText + 0.5;
					}
				});
				row.aggregateRating = [{ text: newText }];
			}
			if (row.weightNet) {
				let newText = '';
				row.weightNet.forEach(item => {
					newText = item.text.replace("Gewicht", "");
				});
				row.weightNet = [{ text: newText.trim() }];
			}
		}
	}

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

module.exports = { transform };
