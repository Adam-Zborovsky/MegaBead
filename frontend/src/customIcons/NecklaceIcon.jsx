export const NecklaceIcon = ({
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
		<path d="M4 6 C4 18 20 18 20 6" />

		<circle cx="5" cy="11.25" r="1.25" fill="none" />
		<circle cx="8.5" cy="14" r="1.25" fill="none" />
		<circle cx="15.25" cy="14" r="1.25" fill="none" />
		<circle cx="18.5" cy="11.25" r="1.25" fill="none" />

		<circle cx="12" cy="17.25" r="2" fill={color} stroke="none" />
	</svg>
);
