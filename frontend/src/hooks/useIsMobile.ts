import { useState, useEffect } from 'react';

/**
 * Returns true when the viewport width is ≤ the given breakpoint.
 * Reacts to resize / orientation changes via matchMedia.
 * Default breakpoint: 899px (mid-tablet is considered desktop).
 */
export function useIsMobile(breakpoint = 899): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
	});

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, [breakpoint]);

	return isMobile;
}
