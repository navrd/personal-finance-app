<script lang="ts">
	import { getById } from '$lib/helpers';
	import type { Budget, Category, ColorTheme, Transaction } from '$lib/types';
	import { getContext, onMount } from 'svelte';

	interface DataSegment {
		label: string;
		value: number;
		color: string;
	}

	interface Props {
		radius?: number;
		strokeWidth?: number;
		animationDuration?: number;
	}

	let { radius = 100, strokeWidth = 20, animationDuration = 2000 }: Props = $props();
	let themes: ColorTheme[] = getContext('themes')
	let budgets: () => Budget[] = getContext('budgets');
	let transactions: () => Transaction[] = getContext('transactions');
	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');

	let getTotalSpentOnBudgetedCategories = $derived.by(() => {
		const budgetCategoryIds = new Set(budgets().map((budget) => budget.category_id));
		let total = transactions().reduce((total, transaction) => {
			return budgetCategoryIds.has(transaction.category_id) ? total + transaction.amount : total;
		}, 0);

		return Math.abs(total)
	});

	let totalLimit = $derived(budgets().reduce((acc, { maximum }) => acc + maximum, 0));
	let preparedBudgets = $derived.by(() => {
		let result: DataSegment[] = [];
		budgets().forEach((budget) => {
			let segment: DataSegment = { label: '', value: 0, color: '' };
			segment.label = getById(categories, budget.category_id)!.category;
			segment.value = Math.round((budget.maximum / totalLimit) * 100);
			segment.color = getById(themes, budget.theme_id)!.theme;
			result.push(segment);
		});
		return result;
	});

	let outerAnimatedValues: number[] = $derived(preparedBudgets.map(() => 0));
	let innerAnimatedValues: number[] = $derived(preparedBudgets.map(() => 0));
	let animationId: number | null = null;

	const outerCircumference: number = 2 * Math.PI * radius;
	const innerCircumference: number = 2 * Math.PI * (radius - strokeWidth / 2);
	const svgSize: number = (radius + strokeWidth) * 2;
	const center: number = svgSize / 2;

	let conditionalSvgSize = $derived.by(() => svgSize);
	let conditionalCenter = $derived.by(() => center);
	// Calculate total and percentages
	const total: number = $derived(preparedBudgets.reduce((sum, item) => sum + item.value, 0));
	const outerSegments: Array<
		DataSegment & {
			percentage: number;
			animatedPercentage: number;
			startAngle: number;
			endAngle: number;
			dashArray: string;
			dashOffset: number;
		}
	> = $derived.by(() => {
		let cumulativePercentage = 0;

		return preparedBudgets.map((item, index) => {
			const percentage = (item.value / total) * 100;
			const animatedPercentage = (outerAnimatedValues[index] / total) * 100;

			const startAngle = cumulativePercentage * 3.6; // Convert to degrees
			const endAngle = (cumulativePercentage + animatedPercentage) * 3.6;

			// Calculate dash array and offset for this segment
			const segmentLength = (animatedPercentage / 100) * outerCircumference;
			const dashArray = `${segmentLength} ${outerCircumference}`;
			const dashOffset = (-cumulativePercentage * outerCircumference) / 100;

			cumulativePercentage += animatedPercentage;

			return {
				...item,
				percentage,
				animatedPercentage,
				startAngle,
				endAngle,
				dashArray,
				dashOffset
			};
		});
	});

	const innerSegments: Array<
		DataSegment & {
			percentage: number;
			animatedPercentage: number;
			startAngle: number;
			endAngle: number;
			dashArray: string;
			dashOffset: number;
		}
	> = $derived.by(() => {
		let cumulativePercentage = 0;

		return preparedBudgets.map((item, index) => {
			const percentage = (item.value / total) * 100;
			const animatedPercentage = (innerAnimatedValues[index] / total) * 100;

			const startAngle = cumulativePercentage * 3.6; // Convert to degrees
			const endAngle = (cumulativePercentage + animatedPercentage) * 3.6;

			// Calculate dash array and offset for this segment
			const segmentLength = (animatedPercentage / 100) * innerCircumference;
			const dashArray = `${segmentLength} ${innerCircumference}`;
			const dashOffset = (-cumulativePercentage * innerCircumference) / 100;

			cumulativePercentage += animatedPercentage;

			return {
				...item,
				percentage,
				animatedPercentage,
				startAngle,
				endAngle,
				dashArray,
				dashOffset
			};
		});
	});

	function easeOutCubic(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}

	function animateChart(): void {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}

		const startTime = Date.now();
		const targetValues = preparedBudgets.map((item) => item.value);

		function animate(): void {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / animationDuration, 1);
			const easedProgress = easeOutCubic(progress);

			innerAnimatedValues = targetValues.map((target) => target * easedProgress);
			outerAnimatedValues = targetValues.map((target) => target * easedProgress);

			if (progress < 1) {
				animationId = requestAnimationFrame(animate);
			} else {
				animationId = null;
			}
		}

		animate();
	}
	onMount(() => {
		animateChart();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
	$effect(() => {
		budgets();
		animateChart();
	});
</script>

<div class="chart">
	<div class="chart__underlay">
		<svg width={conditionalSvgSize} height={conditionalSvgSize}>
			<!-- Background circle -->
			<circle
				cx={conditionalCenter}
				cy={conditionalCenter}
				r={radius}
				fill="none"
				stroke="#f3f4f6"
				stroke-width={strokeWidth}
			/>
			<circle
				cx={conditionalCenter}
				cy={conditionalCenter}
				r={radius - strokeWidth / 2}
				fill="none"
				stroke="#f3f4f6"
				stroke-width={strokeWidth / 2}
			/>
			<!-- Render each segment -->
			{#each outerSegments as segment}
				<circle
					data-segment={segment.label}
					cx={conditionalCenter}
					cy={conditionalCenter}
					r={radius}
					fill="none"
					stroke={segment.color}
					stroke-width={strokeWidth}
					stroke-dasharray={segment.dashArray}
					stroke-dashoffset={segment.dashOffset}
					stroke-linecap="butt"
					style="transform-origin: {conditionalCenter}px {conditionalCenter}px;"
				/>
			{/each}
			{#each innerSegments as segment}
				<circle
					data-segment={segment.label}
					cx={conditionalCenter}
					cy={conditionalCenter}
					fill="none"
					r={radius - strokeWidth / 2}
					stroke={`color-mix(in srgb, ${segment.color} 75%, white)`}
					stroke-width={strokeWidth / 2}
					stroke-dasharray={segment.dashArray}
					stroke-dashoffset={segment.dashOffset}
					style="transform-origin: {conditionalCenter}px {conditionalCenter}px;"
				/>
			{/each}
			<!-- <text
				x={conditionalCenter}
				y={conditionalCenter}
				text-anchor="middle"
				dominant-baseline="central"
				font-size="16"
				fill="black"
				style="font-weight: 700;"
			>
				${totalLimit}
			</text> -->
			<text
				x={conditionalCenter}
				y={conditionalCenter - 10}
				text-anchor="middle"
				font-size="1.5rem"
				style="font-weight: bold"
			>
				${getTotalSpentOnBudgetedCategories}
			</text>

			<text
				x={conditionalCenter}
				y={conditionalCenter + 25}
				text-anchor="middle"
				font-size="0.875rem"
				style="fill: #666;"
			>
				of ${totalLimit} limit
			</text></svg
		>
	</div>
</div>

<style>
</style>
