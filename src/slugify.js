/**
 * @file slugify.js
 * @description Single source of truth for URL slugs, shared by the client
 * router and the build-time prerenderer so the two can never disagree.
 */

export const slugify = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
