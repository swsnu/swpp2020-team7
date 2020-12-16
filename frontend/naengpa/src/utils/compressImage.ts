/* eslint-disable no-unused-expressions */

/* Compress Image using Canvas and img */
const compressImage = async (file: File) => {
	return new Promise<File>((resolve, reject) => {
		const image = document.createElement('img');
		image.src = URL.createObjectURL(file);
		image.onload = () => {
			URL.revokeObjectURL(image.src);
			const canvas = document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;
			const context = canvas.getContext('2d');
			context?.drawImage(image, 0, 0, 200, 200);
			context?.canvas.toBlob(
				(newImageBlob) => {
					if (newImageBlob) {
						resolve(new File([newImageBlob], file.name));
					} else {
						resolve(file);
					}
				},
				'images/jpg',
				0.5,
			);
		};
	});
};
export default compressImage;
