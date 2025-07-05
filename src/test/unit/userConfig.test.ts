import { describe, it, expect } from 'vitest';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { type Result, Ok, Err } from 'oxide.ts';
import { userConfig } from '../../config/userConfig';
import { fromResult } from '../utils/functional-test-utils';

// Type guards for configuration validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url);
};

const isNonEmptyString = (str: string): boolean => {
  return typeof str === 'string' && str.trim().length > 0;
};

const isValidArray = <T>(arr: T[]): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

// Validation functions using Result type
const validateEmail = (email: string): Result<string, string> => {
  return isValidEmail(email) 
    ? Ok(email)
    : Err(`Invalid email format: ${email}`);
};

const validateUrl = (url: string): Result<string, string> => {
  return isValidUrl(url) 
    ? Ok(url)
    : Err(`Invalid URL format: ${url}`);
};

const validateNonEmptyString = (str: string, fieldName: string): Result<string, string> => {
  return isNonEmptyString(str) 
    ? Ok(str)
    : Err(`${fieldName} cannot be empty`);
};

const validateSkills = (skills: string[]): Result<string[], string> => {
  return isValidArray(skills) 
    ? Ok(skills)
    : Err('Skills array cannot be empty');
};

const validateProjects = (projects: unknown[]): Result<unknown[], string> => {
  return isValidArray(projects) 
    ? Ok(projects)
    : Err('Projects array cannot be empty');
};

describe('userConfig', () => {
  describe('Basic Information', () => {
    it('should have valid name', () => {
      const result = validateNonEmptyString(userConfig.name, 'Name');
      expect(result.isOk()).toBe(true);
    });

    it('should have valid role', () => {
      const result = validateNonEmptyString(userConfig.role, 'Role');
      expect(result.isOk()).toBe(true);
    });

    it('should have valid email', () => {
      const result = validateEmail(userConfig.email);
      expect(result.isOk()).toBe(true);
    });

    it('should have valid location', () => {
      const result = validateNonEmptyString(userConfig.location, 'Location');
      expect(result.isOk()).toBe(true);
    });

    it('should have valid age', () => {
      expect(typeof userConfig.age).toBe('number');
      expect(userConfig.age).toBeGreaterThan(0);
    });
  });

  describe('Social Links', () => {
    it('should have valid GitHub URL', () => {
      const result = validateUrl(userConfig.social.github);
      expect(result.isOk()).toBe(true);
    });

    it('should have valid LinkedIn URL', () => {
      const result = validateUrl(userConfig.social.linkedin);
      expect(result.isOk()).toBe(true);
    });
  });

  describe('Contact Information', () => {
    it('should have valid contact email', () => {
      const result = validateEmail(userConfig.contact.email);
      expect(result.isOk()).toBe(true);
    });

    it('should have valid phone number', () => {
      const result = validateNonEmptyString(userConfig.contact.phone, 'Phone');
      expect(result.isOk()).toBe(true);
    });

    it('should have valid Calendly URL', () => {
      const result = validateUrl(userConfig.contact.calendly);
      expect(result.isOk()).toBe(true);
    });
  });

  describe('Resume Configuration', () => {
    it('should have valid resume URL', () => {
      const result = validateUrl(userConfig.resume.url);
      expect(result.isOk()).toBe(true);
    });

    it('should have valid local path', () => {
      const result = validateNonEmptyString(userConfig.resume.localPath, 'Resume local path');
      expect(result.isOk()).toBe(true);
    });
  });

  describe('Education', () => {
    it('should have valid education array', () => {
      expect(Array.isArray(userConfig.education)).toBe(true);
      expect(userConfig.education.length).toBeGreaterThan(0);
    });

    it('should have valid education entries', () => {
      const educationResults = userConfig.education.map(edu => {
        const degreeResult = edu.degree ? Ok(edu.degree) : Err('Missing degree');
        const institutionResult = edu.institution ? Ok(edu.institution) : Err('Missing institution');
        const yearResult = edu.year ? Ok(edu.year) : Err('Missing year');

        return pipe(
          E.Do,
          E.bind('degree', () => fromResult(degreeResult)),
          E.bind('institution', () => fromResult(institutionResult)),
          E.bind('year', () => fromResult(yearResult))
        );
      });

      educationResults.forEach(result => {
        expect(E.isRight(result)).toBe(true);
      });
    });
  });

  describe('Skills', () => {
    it('should have valid skills array', () => {
      expect(Array.isArray(userConfig.skills)).toBe(true);
      expect(userConfig.skills.length).toBeGreaterThan(0);
    });

    it('should have unique skills', () => {
      const uniqueSkills = [...new Set([...userConfig.skills])];
      expect(uniqueSkills.length).toBe(userConfig.skills.length);
    });
  });

  describe('Projects', () => {
    it('should have valid projects array', () => {
      expect(Array.isArray(userConfig.projects)).toBe(true);
      expect(userConfig.projects.length).toBeGreaterThan(0);
    });
  });

  describe('SEO Configuration', () => {
    it('should have valid SEO title', () => {
      const result = validateNonEmptyString(userConfig.seo.title, 'SEO title');
      expect(result.isOk()).toBe(true);
    });

    it('should have valid SEO description', () => {
      const result = validateNonEmptyString(userConfig.seo.description, 'SEO description');
      expect(result.isOk()).toBe(true);
    });

    it('should have valid SEO keywords', () => {
      expect(Array.isArray(userConfig.seo.keywords)).toBe(true);
      expect(userConfig.seo.keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Configuration', () => {
    it('should have valid theme colors', () => {
      const colorRegex = /^#[0-9A-F]{6}$/i;
      
      expect(colorRegex.test(userConfig.theme.primaryColor)).toBe(true);
      expect(colorRegex.test(userConfig.theme.secondaryColor)).toBe(true);
      expect(colorRegex.test(userConfig.theme.accentColor)).toBe(true);
    });
  });
});