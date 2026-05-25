import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProduct, getProductById, updateProduct } from '../services/productService';
import { toast } from 'react-toastify';
import { Upload, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const schema = z.object({
	name: z.string().min(1, 'Product name is required'),
	price: z.coerce.number().min(0, 'Price must be at least 0'),
	type: z.enum(['necklace', 'bracelet']),
	description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof schema>;

interface Product {
	_id: string;
	name: string;
	price: number;
	type: 'necklace' | 'bracelet';
	description: string;
	image?: string;
}

function ProductUpload() {
	useDocumentTitle('Upload product');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEdit = !!id;

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			price: 0,
			type: 'necklace',
			description: '',
		},
	});

	const watched = watch();

	useEffect(() => {
		if (isEdit && id) {
			getProductById(id)
				.then((res) => {
					const p: Product = res.data;
					reset({
						name: p.name,
						price: p.price,
						type: p.type,
						description: p.description,
					});
					if (p.image) {
						setPreviewUrl(`${import.meta.env.VITE_API_URL}/images/${p.image}`);
					}
				})
				.catch(() => {
					toast.error('Failed to load product');
				});
		}
	}, [id, isEdit, reset]);

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith('image/')) {
			setImageFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	}, []);

	const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const onSubmit = async (data: FormData) => {
		try {
			const form = new FormData();
			form.append('name', data.name);
			form.append('price', String(data.price));
			form.append('type', data.type);
			form.append('description', data.description);
			if (imageFile) {
				form.append('image', imageFile);
			}

			if (isEdit && id) {
				await updateProduct(id, form);
				toast.success('Product updated');
			} else {
				await createProduct(form);
				toast.success('Product created');
			}
			navigate('/manage_products');
		} catch (err: unknown) {
			const message =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
				'Upload failed';
			toast.error(message);
		}
	};

	const displayImage = previewUrl || `/images/default_${watched.type}.png`;

	return (
		<div className="min-h-screen bg-bone">
			<section className="border-b border-linen bg-bone">
				<div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
					<button
						onClick={() => navigate('/manage_products')}
						className="inline-flex items-center gap-2 text-sm font-medium text-clay transition-colors hover:text-terracotta"
					>
						<ArrowLeft className="h-4 w-4" aria-hidden="true" />
						Back to inventory
					</button>
					<h1
						className="mt-4 font-[Fraunces] text-3xl font-semibold text-clay"
						style={{ letterSpacing: '-0.01em' }}
					>
						{isEdit ? 'Edit Creation' : 'Add New Creation'}
					</h1>
					<p className="mt-1 text-sm text-clay/70">
						Curate your latest work into the studio inventory. Every bead tells a story, ensure the
						details reflect the craftsmanship.
					</p>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-10 lg:grid-cols-2">
					{/* Form */}
					<motion.form
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Image Dropzone */}
						<div>
							<label className="mb-1.5 block text-sm font-medium text-clay">Image</label>
							<div
								onDrop={onDrop}
								onDragOver={(e) => e.preventDefault()}
								className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-linen bg-bone px-6 py-10 text-center transition-colors hover:border-terracotta/50"
							>
								<Upload className="h-8 w-8 text-clay/40" aria-hidden="true" />
								<p className="mt-3 text-sm font-medium text-clay">
									Drop a high-resolution story here
								</p>
								<p className="text-xs text-clay/50">PNG, JPG or WEBP up to 10MB</p>
								<label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-sm bg-linen px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-linen/80">
									<Upload className="h-4 w-4" aria-hidden="true" />
									Upload
									<input type="file" accept="image/*" className="sr-only" onChange={onFileSelect} />
								</label>
							</div>
							{previewUrl && (
								<div className="mt-4">
									<img
										src={previewUrl}
										alt="Preview"
										className="h-32 w-32 rounded-md object-cover"
									/>
								</div>
							)}
						</div>

						{/* Name */}
						<div>
							<label htmlFor="name" className="mb-1.5 block text-sm font-medium text-clay">
								Product name
							</label>
							<input
								id="name"
								type="text"
								{...register('name')}
								className="w-full rounded-sm border border-linen bg-bone px-4 py-2.5 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
								placeholder="e.g., Dune Tether"
							/>
							{errors.name && <p className="mt-1 text-xs text-terracotta">{errors.name.message}</p>}
						</div>

						{/* Price + Type */}
						<div className="grid gap-5 sm:grid-cols-2">
							<div>
								<label htmlFor="price" className="mb-1.5 block text-sm font-medium text-clay">
									Price
								</label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-clay/50">
										₪
									</span>
									<input
										id="price"
										type="number"
										{...register('price')}
										className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-8 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
										placeholder="0"
									/>
								</div>
								{errors.price && (
									<p className="mt-1 text-xs text-terracotta">{errors.price.message}</p>
								)}
							</div>

							<div>
								<label htmlFor="type" className="mb-1.5 block text-sm font-medium text-clay">
									Type
								</label>
								<select
									id="type"
									{...register('type')}
									className="w-full rounded-sm border border-linen bg-bone px-4 py-2.5 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
								>
									<option value="necklace">Necklace</option>
									<option value="bracelet">Bracelet</option>
								</select>
								{errors.type && (
									<p className="mt-1 text-xs text-terracotta">{errors.type.message}</p>
								)}
							</div>
						</div>

						{/* Description */}
						<div>
							<label htmlFor="description" className="mb-1.5 block text-sm font-medium text-clay">
								Description
							</label>
							<textarea
								id="description"
								rows={5}
								{...register('description')}
								className="w-full rounded-sm border border-linen bg-bone px-4 py-2.5 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
								placeholder="Write an editorial story..."
							/>
							{errors.description && (
								<p className="mt-1 text-xs text-terracotta">{errors.description.message}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 disabled:opacity-60 sm:w-auto"
						>
							{isSubmitting
								? isEdit
									? 'Updating...'
									: 'Submitting...'
								: isEdit
									? 'Update creation'
									: 'Submit creation'}
						</button>
					</motion.form>

					{/* Live Preview */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="space-y-6"
					>
						<h2 className="text-sm font-semibold uppercase tracking-widest text-clay/60">
							Live Preview
						</h2>
						<div className="rounded-lg border border-linen bg-bone p-6 shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)]">
							<div className="aspect-square overflow-hidden rounded-md bg-linen">
								<img
									src={displayImage}
									alt={watched.name || 'Preview'}
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="mt-5">
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
										watched.type === 'necklace'
											? 'bg-moss/10 text-moss'
											: 'bg-terracotta/10 text-terracotta'
									}`}
								>
									{watched.type || 'necklace'}
								</span>
								<h3 className="mt-2 font-[Fraunces] text-xl font-semibold text-clay">
									{watched.name || 'Creation Name'}
								</h3>
								<p className="mt-1 text-sm font-medium text-clay/80">
									₪ {(watched.price || 0).toLocaleString()}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-clay/60">
									{watched.description ||
										'Write an editorial story to see it appear here in the shop preview...'}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-lg border border-linen bg-bone p-4">
							<Sparkles
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-terracotta"
								aria-hidden="true"
							/>
							<p className="text-sm text-clay/70">
								Your story matters. High-quality descriptions improve collector engagement by up to
								40%.
							</p>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}

export default ProductUpload;
