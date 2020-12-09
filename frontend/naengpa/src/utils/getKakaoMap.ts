/* KAKO MAP API */
declare global {
	interface Window {
		kakao: any;
	}
}

const getKakaoMap = (container: any, level: number, lat: number, lng: number) => {
	const options = {
		center: new window.kakao.maps.LatLng(lat, lng),
		minLevel: 4,
		maxLevel: 8,
		level,
	};
	const map = new window.kakao.maps.Map(container, options);
	const markerPosition = new window.kakao.maps.LatLng(lat, lng);
	const marker = new window.kakao.maps.Marker({
		position: markerPosition,
	});

	marker.setMap(map);
};

export default getKakaoMap;
