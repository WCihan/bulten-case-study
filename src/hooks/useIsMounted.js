import { useEffect, useRef } from 'react';

export default function useIsMounted() {
	const componentIsMounted = useRef(true);
	useEffect(
		() => () => {
			componentIsMounted.current = false;
		},
		[]
	);
	return componentIsMounted;
}
