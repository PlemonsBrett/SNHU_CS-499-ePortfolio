import { describe, it, expect, vi } from "vitest";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import {
	safeRender,
	safeQueryByTestId,
	fromResult,
} from "../utils/functional-test-utils";
import AppLayout from "../../layouts/AppLayout";

// Mock the components to avoid complex rendering
vi.mock("../../components/global/MacToolbar", () => ({
	default: ({
		onTerminalClick,
		onShowTutorial,
	}: {
		onTerminalClick: () => void;
		onShowTutorial: () => void;
	}) => (
		<div data-testid="mac-toolbar">
			<button
				type="button"
				data-testid="terminal-button"
				onClick={onTerminalClick}
			>
				Terminal
			</button>
			<button
				type="button"
				data-testid="tutorial-button"
				onClick={onShowTutorial}
			>
				Tutorial
			</button>
		</div>
	),
}));

vi.mock("../../components/global/MobileDock", () => ({
	default: ({ onTerminalClick }: { onTerminalClick: () => void }) => (
		<div data-testid="mobile-dock">
			<button
				type="button"
				data-testid="mobile-terminal-button"
				onClick={onTerminalClick}
			>
				Terminal
			</button>
		</div>
	),
}));

vi.mock("../../components/global/DesktopDock", () => ({
	default: ({ onTerminalClick }: { onTerminalClick: () => void }) => (
		<div data-testid="desktop-dock">
			<button
				type="button"
				data-testid="desktop-terminal-button"
				onClick={onTerminalClick}
			>
				Terminal
			</button>
		</div>
	),
}));

vi.mock("../../components/global/MacTerminal", () => ({
	default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? (
			<div data-testid="mac-terminal">
				<button type="button" data-testid="terminal-close" onClick={onClose}>
					Close
				</button>
			</div>
		) : null,
}));

vi.mock("../../components/global/NotesApp", () => ({
	default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? (
			<div data-testid="notes-app">
				<button type="button" data-testid="notes-close" onClick={onClose}>
					Close
				</button>
			</div>
		) : null,
}));

vi.mock("../../components/global/GitHubViewer", () => ({
	default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? (
			<div data-testid="github-viewer">
				<button type="button" data-testid="github-close" onClick={onClose}>
					Close
				</button>
			</div>
		) : null,
}));

vi.mock("../../components/global/ResumeViewer", () => ({
	default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? (
			<div data-testid="resume-viewer">
				<button type="button" data-testid="resume-close" onClick={onClose}>
					Close
				</button>
			</div>
		) : null,
}));

const mockProps = {
	initialBg: "bg-1",
	backgroundMap: {
		"bg-1": "/bg1.jpg",
		"bg-2": "/bg2.jpg",
		"bg-3": "/bg3.jpg",
	},
};

describe("AppLayout", () => {
	it("should render without errors", () => {
		const renderResult = safeRender(<AppLayout {...mockProps} />);

		expect(renderResult.isOk()).toBe(true);
	});

	it("should render mac toolbar", () => {
		const result = pipe(
			safeRender(<AppLayout {...mockProps} />),
			fromResult,
			E.chain(() => fromResult(safeQueryByTestId("mac-toolbar"))),
		);

		expect(E.isRight(result)).toBe(true);
	});

	it("should render mobile dock", () => {
		const result = pipe(
			safeRender(<AppLayout {...mockProps} />),
			fromResult,
			E.chain(() => fromResult(safeQueryByTestId("mobile-dock"))),
		);

		expect(E.isRight(result)).toBe(true);
	});

	it("should render desktop dock", () => {
		const result = pipe(
			safeRender(<AppLayout {...mockProps} />),
			fromResult,
			E.chain(() => fromResult(safeQueryByTestId("desktop-dock"))),
		);

		expect(E.isRight(result)).toBe(true);
	});

	it("should not render apps initially", () => {
		safeRender(<AppLayout {...mockProps} />);

		const terminalResult = safeQueryByTestId("mac-terminal");
		const notesResult = safeQueryByTestId("notes-app");
		const githubResult = safeQueryByTestId("github-viewer");
		const resumeResult = safeQueryByTestId("resume-viewer");

		expect(terminalResult.isErr()).toBe(true);
		expect(notesResult.isErr()).toBe(true);
		expect(githubResult.isErr()).toBe(true);
		expect(resumeResult.isErr()).toBe(true);
	});

	it("should handle background map correctly", () => {
		const backgroundMap = {
			"bg-1": "/test-bg1.jpg",
			"bg-2": "/test-bg2.jpg",
		};

		const result = safeRender(
			<AppLayout initialBg="bg-1" backgroundMap={backgroundMap} />,
		);

		expect(result.isOk()).toBe(true);
	});
});
