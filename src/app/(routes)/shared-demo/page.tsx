
"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
	Button,
	Avatar,
	Badge,
	Card,
	AccountCard,
	ExpensesBreakdown,
	PopupInput,
	TransactionItem,
	TransactionList,
	SidebarProfile,
	MenuLogout,
	Sidebar,
	BillingItem,
	DashboardHeader,
	Input,
	PasswordInput,
	PhoneInput,
	Modal,
	EmptyState,
	Spinner,
	Skeleton,
	SkeletonCard,
	SkeletonList,
} from "@shared/ui";
import {
	LayoutDashboard,
	Wallet,
	ArrowLeftRight,
	Receipt,
	TrendingDown,
	Target,
	Settings,
} from "lucide-react";
import { Gamepad2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
	const [isPopupOpen, setPopupOpen] = useState(false);

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
				<div className="flex gap-3 items-center flex-wrap">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="danger">Danger</Button>
					<Button isLoading>Loading</Button>
				</div>
			</Section>

			{/* ── Figma Button Sizes ───────────────────────────────── */}
			<Section title="Buttons — Figma Sizes">
				<div className="flex flex-col items-start gap-4">
					{/* 1. Add Accounts — px-8 py-3, bold, full-width */}
					<Button size="figma-2xl" fullWidth>Add Accounts</Button>

					{/* 2. Details > — px-5 py-2, icon end, gap 8px */}
					<Button size="figma-md" icon={<ChevronRight size={16} />} iconPosition="end">Details</Button>

					{/* 3. Check — px-9 py-3 */}
					<Button size="figma-xl">Check</Button>

					{/* 4. Details small — px-4 py-1 */}
					<Button size="figma-sm">Details</Button>
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

			{/* ── Account Card ─────────────────────────────────────── */}
			<Section title="Account Card">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<AccountCard
						cardType="Master Card"
						cardNetwork="mastercard"
						accountNumber="133 456 886 8****"
						totalAmount="$25000"
					/>
					<AccountCard
						cardType="Visa"
						cardNetwork="visa"
						accountNumber="4111 1111 1111 1111"
						totalAmount="$12500"
					/>
				</div>
			</Section>

			{/* ── Expenses Breakdown ───────────────────────────────── */}
			<Section title="Expenses Breakdown">
				<ExpensesBreakdown />
			</Section>

			{/* ── Transaction Item (card variant) ─────────────────── */}
			<Section title="Transaction Item">
				<div className="flex flex-row gap-2">
					<TransactionItem
						icon={<Gamepad2 size={24} />}
						name="GTR 5"
						shopName="Gadget & Gear"
						date="17 May 2023"
						amount="$160.00"
					/>
					<TransactionItem
						icon={<Gamepad2 size={24} />}
						name="Polo shirt"
						shopName="XL fashions"
						date="17 May 2023"
						amount="$20.00"
					/>
				</div>
			</Section>

			{/* ── Transaction List (table variant) ────────────────── */}
			<Section title="Transaction List">
				<TransactionList />
			</Section>

			{/* ── Sidebar Profile ─────────────────────────────────── */}
			<Section title="Sidebar Profile">
				<div className="rounded-2xl bg-card p-6">
					<SidebarProfile
						name="Tanzir Rahman"
						onViewProfile={() => {}}
						menuItems={[
							{ label: "Settings" },
							{ label: "Sign out" },
						]}
					/>
				</div>
				<div className="rounded-2xl bg-gray-01 p-6 mt-3">
					<SidebarProfile
						name="Tanzir Rahman"
						avatarSrc="https://i.pravatar.cc/32?img=12"
						onViewProfile={() => {}}
						menuItems={[
							{ label: "Settings" },
							{ label: "Sign out" },
						]}
					/>
				</div>
			</Section>

			{/* ── Menu Logout ─────────────────────────────────────── */}
			<Section title="Menu Logout">
				<div className="inline-flex rounded-2xl bg-foreground">
					<MenuLogout onClick={() => {}} />
				</div>
			</Section>

			{/* ── Sidebar ────────────────────────────────────────── */}
			<Section title="Sidebar">
				<div className="h-160 w-fit overflow-hidden rounded-2xl">
					<Sidebar
						items={[
							{ label: "Overview", icon: LayoutDashboard, href: "/" },
							{ label: "Balances", icon: Wallet, href: "/balances" },
							{ label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
							{ label: "Bills", icon: Receipt, href: "/bills" },
							{ label: "Expenses", icon: TrendingDown, href: "/expenses" },
							{ label: "Goals", icon: Target, href: "/goals" },
							{ label: "Settings", icon: Settings, href: "/settings" },
						]}
						activeHref="/"
						user={{ name: "Tanzir Rahman", avatarSrc: "https://i.pravatar.cc/32?img=12" }}
						profileMenuItems={[
							{ label: "Settings" },
							{ label: "Sign out" },
						]}
					/>
				</div>
			</Section>

			{/* ── Billing Item ────────────────────────────────────── */}
			<Section title="Billing Item">
				<div className="rounded-2xl bg-card p-6 space-y-3">
					<BillingItem
						month="May"
						day={15}
						logo={
							<div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-heading-md font-bold text-foreground">
								F
							</div>
						}
						serviceName="Figma"
						title="Figma — Yearly Plan"
						description="For advanced security and more flexible controls, the Professional plan helps you scale design processes company-wide."
						billingDate="14 May, 2022"
						amount="$150"
					/>
					<BillingItem
						month="Jun"
						day={3}
						serviceName="Notion"
						title="Notion — Pro Plan"
						description="Unlimited pages and blocks, unlimited file uploads, and priority support."
						billingDate="03 Jun, 2022"
						amount="$48"
					/>
				</div>
			</Section>

			{/* ── Dashboard Header ─────────────────────────────────── */}
			<Section title="Dashboard Header">
				<div className="rounded-2xl overflow-hidden">
					<DashboardHeader
						userName="Tanzir"
						date="May 19, 2023"
						hasNotification
					/>
				</div>
			</Section>

			<Section title="Input">
				<div className="grid md:grid-cols-2 gap-4">
					<Input label="Name" placeholder="Enter your name" />
					<Input label="Email" placeholder="email@example.com" error="Invalid email" />
				</div>
			</Section>

			{/* ── Figma Field Inputs ───────────────────────────────── */}
			<Section title="Inputs — Figma Spec">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Row 1: Email */}
					<Input placeholder="hello@example.com" type="email" />
					<Input placeholder="johndoe@email.com" type="email" />

					{/* Row 2: Password (hidden) */}
					<PasswordInput placeholder="············" />
					<PasswordInput placeholder="············" />

					{/* Row 3: Phone */}
					<PhoneInput placeholder="Phone number" />
					<PhoneInput placeholder="Phone number" />

					{/* Row 4: Password (revealed) */}
					<PasswordInput defaultValue="152@@##PAss" revealed />
					<PasswordInput defaultValue="152@@##PAss" revealed />
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

			{/* ── Popup Input ─────────────────────────────────────── */}
			<Section title="Popup Input">
				<Button onClick={() => setPopupOpen(true)}>Open Popup</Button>
				<PopupInput
					open={isPopupOpen}
					onClose={() => setPopupOpen(false)}
					fields={[
						{ label: "Target Amounts", placeholder: "$500000", type: "text" },
						{ label: "Present Amounts", placeholder: "Write presents amounts here" },
					]}
					onSubmit={(v) => console.log("PopupInput submit:", v)}
				/>
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

			{/* ── Checkbox ─────────────────────────────────────────── */}
			<Section title="Checkbox">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<Checkbox id="cb-checked" defaultChecked />
						<Label htmlFor="cb-checked" className="text-body-md">Keep me signed in (checked)</Label>
					</div>
					<div className="flex items-center gap-3">
						<Checkbox id="cb-unchecked" />
						<Label htmlFor="cb-unchecked" className="text-body-md">Keep me signed in (unchecked)</Label>
					</div>
					<div className="flex items-center gap-3">
						<Checkbox id="cb-disabled" disabled />
						<Label htmlFor="cb-disabled" className="text-body-md text-gray-03">Disabled</Label>
					</div>
				</div>
			</Section>

			{/* ── Typography ───────────────────────────────────────── */}
			<Section title="Typography Scale">
				<div className="space-y-3 divide-y divide-border">
					{[
						{ cls: "text-display-lg",  label: "display-lg",  spec: "24px / 28px / Bold" },
						{ cls: "text-display-md",  label: "display-md",  spec: "22px / 32px / Bold" },
						{ cls: "text-display-sm",  label: "display-sm",  spec: "20px / 28px / Semibold" },
						{ cls: "text-heading-lg",  label: "heading-lg",  spec: "18px / 24px / Semibold" },
						{ cls: "text-heading-md",  label: "heading-md",  spec: "16px / 24px / Semibold" },
						{ cls: "text-body-lg",     label: "body-lg",     spec: "16px / 24px / Regular" },
						{ cls: "text-body-md",     label: "body-md",     spec: "14px / 20px / Regular" },
						{ cls: "text-body-sm",     label: "body-sm",     spec: "12px / 16px / Regular" },
						{ cls: "text-label-lg",    label: "label-lg",    spec: "14px / 20px / Medium" },
						{ cls: "text-label-md",    label: "label-md",    spec: "12px / 16px / Medium" },
					].map(({ cls, label, spec }) => (
						<div key={cls} className="flex items-baseline justify-between pt-3 first:pt-0">
							<span className={cls}>The quick brown fox jumps</span>
							<span className="text-body-sm text-gray-02 ml-4 shrink-0">.{label} — {spec}</span>
						</div>
					))}
				</div>
			</Section>

			{/* ── Color Palette ────────────────────────────────────── */}
			<Section title="Color Palette">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					{[
						{ label: "primary",       bg: "bg-primary",           text: "text-primary-foreground",  hex: "#299D91" },
						{ label: "primary-access",bg: "bg-primary-accessible",text: "text-primary-foreground",  hex: "#1E7A70" },
						{ label: "success",       bg: "bg-success",           text: "text-white",               hex: "#4DAF6E" },
						{ label: "destructive",   bg: "bg-destructive",       text: "text-white",               hex: "#E73D1C" },
						{ label: "foreground",    bg: "bg-foreground",        text: "text-background",          hex: "#191919" },
						{ label: "secondary-fg",  bg: "bg-secondary-foreground", text: "text-background",       hex: "#525256" },
						{ label: "gray-01",       bg: "bg-gray-01",           text: "text-white",               hex: "#666666" },
						{ label: "gray-02",       bg: "bg-gray-02",           text: "text-white",               hex: "#878787" },
						{ label: "gray-03",       bg: "bg-gray-03",           text: "text-foreground",          hex: "#9F9F9F" },
						{ label: "gray-04",       bg: "bg-gray-04",           text: "text-foreground",          hex: "#E8E8E8" },
						{ label: "gray-05",       bg: "bg-gray-05",           text: "text-foreground",          hex: "#F3F3F3" },
						{ label: "border",        bg: "bg-border",            text: "text-foreground",          hex: "#E8E8E8" },
					].map(({ label, bg, text, hex }) => (
						<div key={label} className={`${bg} ${text} rounded-md p-3`}>
							<p className="text-label-lg">{label}</p>
							<p className="text-label-md opacity-80">{hex}</p>
						</div>
					))}
				</div>
			</Section>

			<div className="mt-12 text-sm text-gray-500">This page renders a curated set of components from the shared UI kit.</div>
		</main>
	);
}
