import { Result, Ok, Err } from 'oxide.ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';

// Convert oxide.ts Result to fp-ts Either
export const fromResult = <T, E>(result: Result<T, E>): E.Either<E, T> => {
  return result.isOk() ? E.right(result.unwrap()) : E.left(result.unwrapErr());
};

// Error types for testing
export type TestError =
  | { readonly _tag: 'RenderError'; readonly message: string }
  | { readonly _tag: 'InteractionError'; readonly message: string }
  | { readonly _tag: 'AssertionError'; readonly message: string }
  | { readonly _tag: 'TimeoutError'; readonly message: string };

// Create error constructors
export const TestError = {
  RenderError: (message: string): TestError => ({ _tag: 'RenderError', message }),
  InteractionError: (message: string): TestError => ({ _tag: 'InteractionError', message }),
  AssertionError: (message: string): TestError => ({ _tag: 'AssertionError', message }),
  TimeoutError: (message: string): TestError => ({ _tag: 'TimeoutError', message }),
};

// Safe render function that returns Result
export const safeRender = (component: React.ReactElement): Result<RenderResult, TestError> => {
  return Result.safe(() => render(component))
    .mapErr(error => TestError.RenderError(error instanceof Error ? error.message : String(error)));
};

// Safe element query functions
export const safeQueryByTestId = (testId: string): Result<HTMLElement, TestError> => {
  const element = screen.queryByTestId(testId);
  return element
    ? Ok(element)
    : Err(TestError.AssertionError(`Element with testId "${testId}" not found`));
};

export const safeQueryByRole = (role: string): Result<HTMLElement, TestError> => {
  const element = screen.queryByRole(role);
  return element
    ? Ok(element)
    : Err(TestError.AssertionError(`Element with role "${role}" not found`));
};

export const safeQueryByText = (text: string): Result<HTMLElement, TestError> => {
  const element = screen.queryByText(text);
  return element
    ? Ok(element)
    : Err(TestError.AssertionError(`Element with text "${text}" not found`));
};

// Safe user interactions
export const safeClick = async (element: HTMLElement): Promise<Result<void, TestError>> => {
  const result = await Result.safe(userEvent.click(element));
  return result
    .mapErr(error => TestError.InteractionError(error instanceof Error ? error.message : String(error)))
    .map(() => undefined);
};

export const safeType = async (element: HTMLElement, text: string): Promise<Result<void, TestError>> => {
  const result = await Result.safe(userEvent.type(element, text));
  return result
    .mapErr(error => TestError.InteractionError(error instanceof Error ? error.message : String(error)))
    .map(() => undefined);
};

// Safe async operations
export const safeWaitFor = <T>(
  callback: () => T,
  options?: { timeout?: number }
): TE.TaskEither<TestError, T> => {
  return TE.tryCatch(
    () => waitFor(callback, options),
    error => TestError.TimeoutError(error instanceof Error ? error.message : String(error))
  );
};

// Functional test assertion helpers
export const assertElementExists = (testId: string): E.Either<TestError, HTMLElement> => {
  return pipe(
    safeQueryByTestId(testId),
    fromResult
  );
};

export const assertElementHasText = (element: HTMLElement, expectedText: string): E.Either<TestError, void> => {
  return element.textContent?.includes(expectedText)
    ? E.right(undefined)
    : E.left(TestError.AssertionError(`Element does not contain text "${expectedText}"`));
};

export const assertElementHasClass = (element: HTMLElement, className: string): E.Either<TestError, void> => {
  return element.classList.contains(className)
    ? E.right(undefined)
    : E.left(TestError.AssertionError(`Element does not have class "${className}"`));
};

// Functional test composition helpers
export const composeTestSteps = <A, B, C>(
  step1: (a: A) => E.Either<TestError, B>,
  step2: (b: B) => E.Either<TestError, C>
) => (input: A): E.Either<TestError, C> => {
  return pipe(
    step1(input),
    E.chain(step2)
  );
};

export const sequenceTestSteps = <T>(
  steps: Array<E.Either<TestError, T>>
): E.Either<TestError, readonly T[]> => {
  return E.sequenceArray(steps);
};

// Mock data builders using functional patterns
export const mockUserConfig = {
  name: 'Test User',
  role: 'Test Role',
  email: 'test@example.com',
  social: {
    github: 'https://github.com/test',
    linkedin: 'https://linkedin.com/test',
  },
  projects: [],
  skills: ['TypeScript', 'React', 'fp-ts'],
} as const;

export const mockProject = {
  id: 'test-project',
  title: 'Test Project',
  description: 'A test project',
  technologies: ['TypeScript', 'React'],
  githubUrl: 'https://github.com/test/project',
  images: [],
} as const;

// Functional test utilities for async operations
export const createMockFetch = (response: unknown): Mock => {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response),
  });
};

export const createMockFailedFetch = (error: string): Mock => {
  return vi.fn().mockRejectedValue(new Error(error));
};