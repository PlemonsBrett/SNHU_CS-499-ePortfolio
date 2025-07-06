import { useImageGalleryState } from "./functions";
import type { ImageGalleryProps } from "./props";

const ImageGallery = ({ images }: ImageGalleryProps) => {
	const { activeImageIndex, handleNextImage, handlePrevImage } =
		useImageGalleryState(images.length);

	if (!images || images.length === 0) {
		return null;
	}

	return (
		<div className="mb-4">
			<h4 className="text-lg font-semibold mb-2 text-gray-200">Screenshots</h4>
			<div className="relative">
				<div className="rounded-lg overflow-hidden mb-2">
					<img
						src={images[activeImageIndex].url}
						alt={images[activeImageIndex].alt}
						className="w-full object-cover"
					/>
				</div>

				<div className="text-sm text-gray-300 mb-3">
					{images[activeImageIndex].description}
				</div>

				{images.length > 1 && (
					<div className="flex justify-between mt-2">
						<button
							type="button"
							onClick={handlePrevImage}
							className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
						>
							←
						</button>
						<span className="text-gray-400">
							{activeImageIndex + 1} / {images.length}
						</span>
						<button
							type="button"
							onClick={handleNextImage}
							className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
						>
							→
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageGallery;