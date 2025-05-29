export const BraceletIcon = ({
	size = 24,
	color = "currentColor",
	...props
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="8" />

		<circle cx="12" cy="4" r="1.25" fill="none" />
		<circle cx="6" cy="6" r="1.25" fill="none" />
		<circle cx="4" cy="12" r="1.25" fill="none" />
		<circle cx="6" cy="18" r="1.25" fill="none" />
		<circle cx="12" cy="20" r="1.25" fill="none" />
		<circle cx="18" cy="18" r="1.25" fill="none" />
		<circle cx="20" cy="12" r="1.25" fill="none" />
		<circle cx="18" cy="6" r="1.25" fill="none" />
	</svg>
);
