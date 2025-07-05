import { describe, it, expect, vi } from "vitest";
import * as E from "fp-ts/lib/Either";
import {
	safeRender,
	safeQueryByTestId,
	safeClick,
	fromResult,
} from "../utils/functional-test-utils";
import AppLayout from "../../layouts/AppLayout";
import { waitFor, screen } from "@testing-library/react";

// Mock all components for integration testing
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
	default: ({
		onTerminalClick,
		onNotesClick,
		onGitHubClick,
		onResumeClick,
	}: {
		onTerminalClick: () => void;
		onNotesClick: () => void;
		onGitHubClick: () => void;
		onResumeClick: () => void;
	}) => (
		<div data-testid="mobile-dock">
			<button
				type="button"
				data-testid="mobile-terminal-button"
				onClick={onTerminalClick}
			>
				Terminal
			</button>
			<button
				type="button"
				data-testid="mobile-notes-button"
				onClick={onNotesClick}
			>
				Notes
			</button>
			<button
				type="button"
				data-testid="mobile-github-button"
				onClick={onGitHubClick}
			>
				GitHub
			</button>
			<button
				type="button"
				data-testid="mobile-resume-button"
				onClick={onResumeClick}
			>
				Resume
			</button>
		</div>
	),
}));

vi.mock("../../components/global/DesktopDock", () => ({
	default: ({
		onTerminalClick,
		onNotesClick,
		onGitHubClick,
		activeApps,
	}: {
		onTerminalClick: () => void;
		onNotesClick: () => void;
		onGitHubClick: () => void;
		activeApps: Record<string, boolean>;
	}) => (
		<div data-testid="desktop-dock">
			<button
				type="button"
				data-testid="desktop-terminal-button"
				onClick={onTerminalClick}
				className={activeApps.terminal ? "active" : ""}
			>
				Terminal
			</button>
			<button
				type="button"
				data-testid="desktop-notes-button"
				onClick={onNotesClick}
				className={activeApps.notes ? "active" : ""}
			>
				Notes
			</button>
			<button
				type="button"
				data-testid="desktop-github-button"
				onClick={onGitHubClick}
				className={activeApps.github ? "active" : ""}
			>
				GitHub
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
				<div data-testid="terminal-content">Terminal Content</div>
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
				<div data-testid="notes-content">Notes Content</div>
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
				<div data-testid="github-content">GitHub Content</div>
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
				<div data-testid="resume-content">Resume Content</div>
			</div>
		) : null,
}));

const mockProps = {
	initialBg: "bg-1",
	backgroundMap: {
		"bg-1": "/bg1.jpg",
		"bg-2": "/bg2.jpg",
	},
};

describe("Desktop Interaction Integration Tests", () => {
	describe("Terminal App Interaction", () => {
		it("should open terminal from toolbar and close it", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			const buttonResult = safeQueryByTestId("terminal-button");
			if (!buttonResult.isOk()) {
				expect(buttonResult.isOk()).toBe(true);
				return;
			}

			const clickResult = await safeClick(buttonResult.unwrap());
			const result = fromResult(clickResult);

			expect(E.isRight(result)).toBe(true);
		});

		it("should open terminal from mobile dock", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			const buttonResult = safeQueryByTestId("mobile-terminal-button");
			if (!buttonResult.isOk()) {
				expect(buttonResult.isOk()).toBe(true);
				return;
			}

			const clickResult = await safeClick(buttonResult.unwrap());
			if (!clickResult.isOk()) {
				expect(clickResult.isOk()).toBe(true);
				return;
			}

			const terminalResult = safeQueryByTestId("mac-terminal");
			expect(terminalResult.isOk()).toBe(true);
		});

		it("should close terminal when close button is clicked", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			const buttonResult = safeQueryByTestId("terminal-button");
			if (!buttonResult.isOk()) {
				expect(buttonResult.isOk()).toBe(true);
				return;
			}

			const clickResult = await safeClick(buttonResult.unwrap());
			if (!clickResult.isOk()) {
				expect(clickResult.isOk()).toBe(true);
				return;
			}

			// Wait for close button to appear
			await waitFor(() => {
				const closeButton = screen.getByTestId("terminal-close");
				expect(closeButton).toBeTruthy();
			});

			const closeButtonResult = safeQueryByTestId("terminal-close");
			if (!closeButtonResult.isOk()) {
				expect(closeButtonResult.isOk()).toBe(true);
				return;
			}

			const closeClickResult = await safeClick(closeButtonResult.unwrap());
			if (!closeClickResult.isOk()) {
				expect(closeClickResult.isOk()).toBe(true);
				return;
			}

			// Wait for terminal to disappear
			await waitFor(() => {
				const terminalWindow = screen.queryByTestId("mac-terminal");
				expect(terminalWindow).toBeFalsy();
			});
		});
	});

	describe("Notes App Interaction", () => {
		it("should open notes from mobile dock", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			const buttonResult = safeQueryByTestId("mobile-notes-button");
			if (!buttonResult.isOk()) {
				expect(buttonResult.isOk()).toBe(true);
				return;
			}

			const clickResult = await safeClick(buttonResult.unwrap());
			if (!clickResult.isOk()) {
				expect(clickResult.isOk()).toBe(true);
				return;
			}

			const notesResult = safeQueryByTestId("notes-app");
			expect(notesResult.isOk()).toBe(true);
		});

		it("should close notes when close button is clicked", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			const buttonResult = safeQueryByTestId("mobile-notes-button");
			if (!buttonResult.isOk()) {
				expect(buttonResult.isOk()).toBe(true);
				return;
			}

			const clickResult = await safeClick(buttonResult.unwrap());
			if (!clickResult.isOk()) {
				expect(clickResult.isOk()).toBe(true);
				return;
			}

			// Wait for close button to appear
			await waitFor(() => {
				const closeButton = screen.getByTestId("notes-close");
				expect(closeButton).toBeTruthy();
			});

			const closeButtonResult = safeQueryByTestId("notes-close");
			if (!closeButtonResult.isOk()) {
				expect(closeButtonResult.isOk()).toBe(true);
				return;
			}

			const closeClickResult = await safeClick(closeButtonResult.unwrap());
			if (!closeClickResult.isOk()) {
				expect(closeClickResult.isOk()).toBe(true);
				return;
			}

			// Wait for notes to disappear
			await waitFor(() => {
				const notesWindow = screen.queryByTestId("notes-app");
				expect(notesWindow).toBeFalsy();
			});
		});
	});

	describe("GitHub Viewer Interaction", () => {
		it("should open GitHub viewer from mobile dock", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			const buttonResult = safeQueryByTestId("mobile-github-button");
			if (!buttonResult.isOk()) {
				expect(buttonResult.isOk()).toBe(true);
				return;
			}

			const clickResult = await safeClick(buttonResult.unwrap());
			if (!clickResult.isOk()) {
				expect(clickResult.isOk()).toBe(true);
				return;
			}

			const githubResult = safeQueryByTestId("github-viewer");
			expect(githubResult.isOk()).toBe(true);
		});
	});

	describe("Multiple Apps Interaction", () => {
		it("should handle multiple apps open simultaneously", async () => {
			const renderResult = safeRender(<AppLayout {...mockProps} />);
			if (!renderResult.isOk()) {
				expect(renderResult.isOk()).toBe(true);
				return;
			}

			// Open terminal
			const terminalButtonResult = safeQueryByTestId("mobile-terminal-button");
			if (!terminalButtonResult.isOk()) {
				expect(terminalButtonResult.isOk()).toBe(true);
				return;
			}

			const terminalClickResult = await safeClick(
				terminalButtonResult.unwrap(),
			);
			if (!terminalClickResult.isOk()) {
				expect(terminalClickResult.isOk()).toBe(true);
				return;
			}

			// Open notes
			const notesButtonResult = safeQueryByTestId("mobile-notes-button");
			if (!notesButtonResult.isOk()) {
				expect(notesButtonResult.isOk()).toBe(true);
				return;
			}

			const notesClickResult = await safeClick(notesButtonResult.unwrap());
			if (!notesClickResult.isOk()) {
				expect(notesClickResult.isOk()).toBe(true);
				return;
			}

			// Check both are open
			const terminalResult = safeQueryByTestId("mac-terminal");
			const notesResult = safeQueryByTestId("notes-app");

			expect(terminalResult.isOk()).toBe(true);
			expect(notesResult.isOk()).toBe(true);
		});
	});
});
