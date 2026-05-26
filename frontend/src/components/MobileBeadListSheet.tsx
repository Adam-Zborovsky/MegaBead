import { useEffect } from 'react';
import BeadList from './BeadList';

interface Bead {
	name: string;
	image: string;
	id: number;
}

interface MobileBeadListSheetProps {
	isOpen: boolean;
	onClose: () => void;
	beads: Bead[];
	onRemoveBead: (index: number) => void;
	handleReset: () => void;
	isFull: boolean;
	onAddToCart: () => void;
}

function MobileBeadListSheet({
	isOpen,
	onClose,
	beads,
	onRemoveBead,
	handleReset,
	isFull,
	onAddToCart,
}: MobileBeadListSheetProps) {
	// Lock body scroll while sheet is visible
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	return (
		<>
			{/* Backdrop */}
			<div
				aria-hidden="true"
				onClick={onClose}
				style={{
					position: 'fixed',
					inset: 0,
					background: 'rgba(26, 22, 18, 0.45)',
					opacity: isOpen ? 1 : 0,
					pointerEvents: isOpen ? 'auto' : 'none',
					transition: 'opacity 0.25s ease',
					zIndex: 200,
				}}
			/>

			{/* Sheet panel */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Bead list"
				style={{
					position: 'fixed',
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 201,
					background: '#FAF8F4',
					borderRadius: '1.25rem 1.25rem 0 0',
					maxHeight: '72vh',
					overflowY: 'auto',
					transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
					transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
					padding: '0.75rem 1rem 2.5rem',
					boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.12)',
				}}
			>
				{/* Drag handle */}
				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
					<div
						style={{
							width: '40px',
							height: '4px',
							background: '#d1ccc5',
							borderRadius: '2px',
						}}
					/>
				</div>

				<BeadList
					beads={beads}
					onRemoveBead={onRemoveBead}
					handleReset={handleReset}
					isFull={isFull}
					onAddToCart={onAddToCart}
				/>
			</div>
		</>
	);
}

export default MobileBeadListSheet;
