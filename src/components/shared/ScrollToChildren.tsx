import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function ScrollToChildren({ children }: Props) {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		rootRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	}, []);

	return <div ref={rootRef}>{children}</div>;
}
