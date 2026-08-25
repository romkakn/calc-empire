import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { BLOG_POSTS, getPostBySlug, getAllPostsSortedByDate } from "../blog.ts";

describe("getPostBySlug", () => {
  test("returns the matching post for a known slug", () => {
    const known = BLOG_POSTS[0];
    const found = getPostBySlug(known.slug);
    assert.ok(found);
    assert.equal(found?.slug, known.slug);
    assert.equal(found?.title, known.title);
  });

  test("returns undefined for an unknown slug", () => {
    assert.equal(getPostBySlug("this-slug-does-not-exist"), undefined);
  });
});

describe("getAllPostsSortedByDate", () => {
  test("returns all posts", () => {
    const sorted = getAllPostsSortedByDate();
    assert.equal(sorted.length, BLOG_POSTS.length);
  });

  test("is sorted by datePublished, strictly descending", () => {
    const sorted = getAllPostsSortedByDate();
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1].datePublished;
      const curr = sorted[i].datePublished;
      assert.ok(
        prev.localeCompare(curr) >= 0,
        `expected posts sorted descending by datePublished, but "${prev}" comes before "${curr}" out of order`,
      );
    }
  });

  test("does not mutate BLOG_POSTS' original order", () => {
    const beforeSlugs = BLOG_POSTS.map((p) => p.slug);
    getAllPostsSortedByDate();
    const afterSlugs = BLOG_POSTS.map((p) => p.slug);
    assert.deepEqual(afterSlugs, beforeSlugs);
  });
});
