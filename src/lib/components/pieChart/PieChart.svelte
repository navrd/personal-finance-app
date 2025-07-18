<script lang="ts">
	import { onMount } from 'svelte';

	interface DataSegment {
		label: string;
		value: number;
		color: string;
	}

	interface Props {
		data?: DataSegment[];
		radius?: number;
		strokeWidth?: number;
		animationDuration?: number;
		showLabels?: boolean;
	}

	let {
		data = [
			{ label: 'JavaScript', value: 35, color: '#f7df1e' },
			{ label: 'TypeScript', value: 25, color: '#3178c6' },
			{ label: 'Python', value: 20, color: '#306998' },
			{ label: 'Rust', value: 15, color: '#ce422b' },
			{ label: 'Go', value: 5, color: '#00add8' }
		],
		radius = 100,
		strokeWidth = 20,
		animationDuration = 2000,
		showLabels = true
	}: Props = $props();

	let outerAnimatedValues: number[] = $state(data.map(() => 0));
	let innerAnimatedValues: number[] = $state(data.map(() => 0));
	let animationId: number | null = null;

	const outerCircumference: number = 2 * Math.PI * radius;
	const innerCircumference: number = 2 * Math.PI * (radius - strokeWidth);
	const svgSize: number = (radius + strokeWidth) * 2;
	const center: number = svgSize / 2;

	let conditionalSvgSize = $derived.by(() => (showLabels ? svgSize + 140 : svgSize));
	let conditionalCenter = $derived.by(() => (showLabels ? center + 70 : center));
	// Calculate total and percentages
	const total: number = $derived(data.reduce((sum, item) => sum + item.value, 0));
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

		return data.map((item, index) => {
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

		return data.map((item, index) => {
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
		const targetValues = data.map((item) => item.value);

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

	function updateData(newData: DataSegment[]): void {
		data = newData;
		animateChart();
	}

	function getLabelPosition(index: number): { x: number; y: number } {
		// We need to match the exact cumulative logic from segments
		// The dashOffset for segment[i] uses cumulative percentage UP TO (but not including) segment[i]
		let cumulativePercentage = 0;

		// Add up animated percentages of all segments before this one
		for (let i = 0; i < index; i++) {
			cumulativePercentage += (outerAnimatedValues[i] / total) * 100;
		}

		// The current segment's animated percentage
		const currentSegmentPercentage = (outerAnimatedValues[index] / total) * 100;

		// The middle of the current segment
		const midPercentage = cumulativePercentage + currentSegmentPercentage / 2;

		// Convert to radians - but we need to account for how the stroke-dashoffset works
		// The stroke starts from 0 degrees (3 o'clock) and goes clockwise
		const angle = (midPercentage / 100) * 360;
		const radian = angle * (Math.PI / 180);

		// Increase label radius to ensure it's outside the chart
		const labelRadius = radius + strokeWidth + 25; // Increased from 20 to 30

		return {
			x: center + labelRadius * Math.cos(radian),
			y: center + labelRadius * Math.sin(radian)
		};
	}
	onMount(() => {
		animateChart();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<div>
	<h2>Multi-Segment Pie Chart</h2>

	<div>
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
				r={radius - strokeWidth}
				fill="none"
				stroke="#f3f4f6"
				stroke-width={strokeWidth}
			/>
			<!-- Render each segment -->
			{#each outerSegments as segment, index}
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
				{#if segment.animatedPercentage > 2 && showLabels}
					{@const labelPos = getLabelPosition(index)}
					{@const delta = showLabels ? 70 : 50}
					<g
						style="transform-origin: {conditionalCenter}px {conditionalCenter}px;"
						data-segment={segment.label}
					>
						<text
							x={labelPos.x + delta}
							y={labelPos.y + delta}
							text-anchor="middle"
							dominant-baseline="middle"
							fill="#374151"
							font-size="12"
							font-weight="600"
						>
							{segment.label}
						</text>
						<text
							x={labelPos.x + delta}
							y={labelPos.y + delta + 15}
							text-anchor="middle"
							dominant-baseline="middle"
							fill="#6b7280"
							font-size="10"
						>
							{segment.percentage.toFixed(1)}%
						</text>
					</g>
				{/if}
			{/each}
			{#each innerSegments as segment}
				<circle
					data-segment={segment.label}
					cx={conditionalCenter}
					cy={conditionalCenter}
					fill="none"
					r={radius - strokeWidth}
					stroke={segment.color}
					stroke-width={strokeWidth}
					stroke-dasharray={segment.dashArray}
					stroke-dashoffset={segment.dashOffset}
					style="transform-origin: {conditionalCenter}px {conditionalCenter}px;"
				/>
			{/each}
		</svg>

		<!-- conditionalCenter total -->
		<div>
			<div>
				<div>{total}</div>
				<div>Total</div>
			</div>
		</div>
	</div>

	<!-- Legend -->
	<div class="flex flex-wrap gap-4 max-w-md">
		{#each outerSegments as segment}
			<div>
				<div style="background-color: {segment.color}"></div>
				<span>
					{segment.label}: {segment.value}
				</span>
			</div>
		{/each}
	</div>

	<!-- Controls -->
	<div>
		<div>
			<button
				onclick={() =>
					updateData([
						{ label: 'Frontend', value: 40, color: '#06b6d4' },
						{ label: 'Backend', value: 35, color: '#8b5cf6' },
						{ label: 'Database', value: 25, color: '#10b981' }
					])}
			>
				Web Dev
			</button>
			<button
				onclick={() =>
					updateData([
						{ label: 'Mobile', value: 30, color: '#f59e0b' },
						{ label: 'Desktop', value: 25, color: '#ef4444' },
						{ label: 'Web', value: 45, color: '#3b82f6' }
					])}
			>
				Platforms
			</button>
			<button
				onclick={() =>
					updateData([
						{ label: 'JavaScript', value: 35, color: '#f7df1e' },
						{ label: 'TypeScript', value: 25, color: '#3178c6' },
						{ label: 'Python', value: 20, color: '#306998' },
						{ label: 'Rust', value: 15, color: '#ce422b' },
						{ label: 'Go', value: 5, color: '#00add8' }
					])}
			>
				Languages
			</button>
		</div>

		<div>
			<label>
				<input type="checkbox" bind:checked={showLabels} />
				<span>Show labels</span>
			</label>
		</div>
	</div>
</div>

<style>
	svg {
		transition:
			width 0.3s ease,
			height 0.3s ease;
	}

	circle {
		transition:
			cx 0.3s ease,
			cy 0.3s ease;
	}
</style>
