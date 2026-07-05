/**
 * Optimizes a Cloudinary URL by injecting width, format, and quality transformations.
 * For non-Cloudinary URLs, returns the original unchanged.
 *
 * @param url     - The image URL
 * @param width   - Desired display width in pixels (Cloudinary will resize server-side)
 * @param quality - Quality level (default: 'auto' - Cloudinary's automatic quality)
 * @returns       - Optimized URL string
 */
export function getOptimizedUrl(url: string, width: number = 800, quality: string = "auto"): string {
	if (!url.includes("res.cloudinary.com")) return url;

	// Build the transformation string
	const transforms = `f_auto,q_${quality},w_${width}`;

	// Cloudinary URL pattern: /image/upload/{transformations}/v{version}/{public_id}
	const uploadSegment = "/image/upload/";
	const idx = url.indexOf(uploadSegment);
	if (idx === -1) return url;

	const afterUpload = url.substring(idx + uploadSegment.length);

	// Check if there's already a transformation segment (doesn't start with 'v' followed by digits)
	const hasExistingTransforms = !/^v\d+\//.test(afterUpload);

	if (hasExistingTransforms) {
		// Replace existing transforms with our optimized ones
		const versionMatch = afterUpload.match(/(v\d+\/.*)$/);
		if (versionMatch) {
			return url.substring(0, idx) + uploadSegment + transforms + "/" + versionMatch[1];
		}
	}

	// No existing transforms - insert ours before the version
	return url.substring(0, idx) + uploadSegment + transforms + "/" + afterUpload;
}

/**
 * Returns a tiny blurred placeholder URL for a Cloudinary image.
 * The placeholder is ~30px wide, heavily compressed, and blurred server-side.
 * This loads in <1KB and can be shown while the full image is loading.
 */
export function getLqipUrl(url: string): string {
	if (!url.includes("res.cloudinary.com")) return "";

	const uploadSegment = "/image/upload/";
	const idx = url.indexOf(uploadSegment);
	if (idx === -1) return "";

	const afterUpload = url.substring(idx + uploadSegment.length);
	const transforms = "f_auto,q_10,w_30,e_blur:800";

	const hasExistingTransforms = !/^v\d+\//.test(afterUpload);
	if (hasExistingTransforms) {
		const versionMatch = afterUpload.match(/(v\d+\/.*)$/);
		if (versionMatch) {
			return url.substring(0, idx) + uploadSegment + transforms + "/" + versionMatch[1];
		}
	}

	return url.substring(0, idx) + uploadSegment + transforms + "/" + afterUpload;
}
