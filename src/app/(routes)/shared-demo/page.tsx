
"use client";

import React, { useState } from "react";
import {
	Button,
	Avatar,
	Badge,
	Card,
	Input,
	Modal,
	EmptyState,
	Spinner,
	Skeleton,
	SkeletonCard,
	SkeletonList,
} from "@shared/ui";
import { sampleAvatarNames, sampleCardText } from "./demo-data";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="mb-8">
			<h3 className="text-lg font-semibold mb-3">{title}</h3>
			<div className="space-y-3">{children}</div>
		</section>
	);
}

export default function SharedDemoPage() {
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<main className="max-w-5xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Shared UI — Demo</h1>

			<Section title="Avatar">
				<div className="flex items-center gap-3">
					{sampleAvatarNames.slice(0, 5).map((n) => (
						<Avatar key={n} name={n} size="sm" />
					))}
					{sampleAvatarNames.slice(0, 3).map((n) => (
						<Avatar key={n + "-md"} name={n} size="md" />
					))}
					<Avatar name="Zoe" size="lg" />
				</div>
			</Section>

			<Section title="Badge">
				<div className="flex gap-2 items-center">
					<Badge>Default</Badge>
					<Badge variant="primary">Primary</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="danger">Danger</Badge>
				</div>
			</Section>

			<Section title="Buttons">
				<div className="flex gap-3 items-center">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="danger">Danger</Button>
					<Button isLoading>Loading</Button>
				</div>
			</Section>

			<Section title="Card">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<h4 className="font-medium">Simple card</h4>
						<p className="text-sm text-gray-500 mt-2">{sampleCardText}</p>
					</Card>

					<Card hoverable padding="lg">
						<h4 className="font-medium">Hoverable card</h4>
						<p className="text-sm text-gray-500 mt-2">Interactive styles visible on hover.</p>
					</Card>
				</div>
			</Section>

			<Section title="Input">
				<div className="grid md:grid-cols-2 gap-4">
					<Input label="Name" placeholder="Enter your name" />
					<Input label="Email" placeholder="email@example.com" error="Invalid email" />
				</div>
			</Section>

			<Section title="Modal">
				<div className="flex gap-3 items-center">
					<Button onClick={() => setModalOpen(true)}>Open Modal</Button>
					<Modal open={isModalOpen} onClose={() => setModalOpen(false)} title="Demo modal">
						<p className="text-sm text-gray-600">This is an example modal using the shared `Modal` component.</p>
						<div className="mt-4 flex justify-end">
							<Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
						</div>
					</Modal>
				</div>
			</Section>

			<Section title="Empty State">
				<div className="grid md:grid-cols-2 gap-4">
					<EmptyState title="No posts yet" description="Create your first post to get started." action={{ label: "Create post" }} />
					<EmptyState title="No results" description="Try adjusting your filters." size="sm" />
				</div>
			</Section>

			<Section title="Loaders / Skeletons">
				<div className="flex gap-4 items-start">
					<div className="flex items-center gap-2"><Spinner /> <span className="text-sm text-gray-600">Spinner</span></div>
					<div className="w-60"><Skeleton className="h-6 w-full" /></div>
				</div>

				<div className="mt-4 grid md:grid-cols-2 gap-4">
					<SkeletonCard />
					<SkeletonList />
				</div>
			</Section>

			<div className="mt-12 text-sm text-gray-500">This page renders a curated set of components from the shared UI kit.</div>
		</main>
	);
}
