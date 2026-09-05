// ---------------------------------------------------------------------------
// Data-layer regression tests
// ---------------------------------------------------------------------------
// Run with `npm test`, which executes this through `payload run` so the Local
// API and the real SQLite database are available.
//
// These cover the content-correctness bugs found in the audit: category, tag,
// and author listings used to fall back to "the newest posts site-wide" when
// they had nothing of their own, which surfaced unrelated articles under the
// wrong heading (and other reporters' articles under an author's byline).
//
// The tests create their own throwaway records and delete them again in a
// finally block, so they are safe to run against a database with real content.

import assert from "node:assert/strict";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  getArticlesByAuthor,
  getArticlesByCategory,
  getArticlesBySubcategory,
  getArticlesByTag,
  getRelatedArticles,
  searchArticles,
} from "../lib/data";

const payload = await getPayload({ config });

const created: { collection: string; id: number | string }[] = [];
let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (error) {
    failed++;
    console.log(`  FAIL ${name}`);
    console.log(`       ${(error as Error).message.split("\n")[0]}`);
  }
}

async function make(collection: string, data: Record<string, unknown>) {
  const doc = (await payload.create({
    collection: collection as never,
    data: data as never,
  })) as { id: number | string };
  created.push({ collection, id: doc.id });
  return doc;
}

try {
  console.log("\ndata layer: empty records must not borrow other content");

  await make("categories", {
    name: "Test Empty Category",
    slug: "test-empty-category",
    order: 9001,
  });
  await make("authors", {
    name: "Test Empty Author",
    slug: "test-empty-author",
  });
  await make("tags", { name: "Test Empty Tag", slug: "test-empty-tag" });

  await test("a category with no posts returns no articles", async () => {
    assert.deepEqual(await getArticlesByCategory("test-empty-category"), []);
  });

  await test("an author with no posts returns no articles", async () => {
    assert.deepEqual(await getArticlesByAuthor("test-empty-author"), []);
  });

  await test("a tag with no posts returns no articles", async () => {
    assert.deepEqual(await getArticlesByTag("test-empty-tag"), []);
  });

  console.log("\ndata layer: unknown slugs must not resolve to content");

  await test("unknown category slug returns no articles", async () => {
    assert.deepEqual(await getArticlesByCategory("no-such-category"), []);
  });

  await test("unknown author slug returns no articles", async () => {
    assert.deepEqual(await getArticlesByAuthor("no-such-author"), []);
  });

  await test("unknown tag slug returns no articles", async () => {
    assert.deepEqual(await getArticlesByTag("no-such-tag"), []);
  });

  await test("unknown article slug has no related articles", async () => {
    assert.deepEqual(await getRelatedArticles("no-such-article"), []);
  });

  await test("subcategory that isn't a child of the parent returns nothing", async () => {
    // "disaster-events" belongs to disaster-field-alerts, not field-inspections.
    assert.deepEqual(
      await getArticlesBySubcategory("field-inspections", "disaster-events"),
      []
    );
  });

  console.log("\nsearch: LIKE wildcards are treated as literal text");

  const totalPosts = (await payload.count({ collection: "posts" })).totalDocs;

  await test("'%' does not match every post", async () => {
    const results = await searchArticles("%");
    assert.equal(
      results.length,
      0,
      `expected 0 results, got ${results.length} of ${totalPosts} posts`
    );
  });

  await test("'_' does not match every post", async () => {
    assert.equal((await searchArticles("_")).length, 0);
  });

  await test("'a%b' is searched as the literal term 'ab'", async () => {
    const wildcard = (await searchArticles("a%b")).map((a) => a.slug).sort();
    const literal = (await searchArticles("ab")).map((a) => a.slug).sort();
    assert.deepEqual(
      wildcard,
      literal,
      "the % must be removed, not treated as a wildcard or turned into a space"
    );
    assert.ok(
      wildcard.length < totalPosts,
      `'a%b' matched ${wildcard.length} of ${totalPosts} posts`
    );
  });

  await test("'100%' keeps its digits instead of matching everything", async () => {
    const pct = (await searchArticles("100%")).map((a) => a.slug).sort();
    const plain = (await searchArticles("100")).map((a) => a.slug).sort();
    assert.deepEqual(pct, plain);
  });

  await test("an ordinary term still matches", async () => {
    assert.ok((await searchArticles("inspection")).length > 0);
  });

  await test("empty and whitespace-only queries return nothing", async () => {
    assert.deepEqual(await searchArticles(""), []);
    assert.deepEqual(await searchArticles("   "), []);
  });

  console.log("\nschema: invalid input is rejected at the CMS boundary");

  await test("a post with an unparseable date is refused", async () => {
    const cat = await payload.find({ collection: "categories", limit: 1, depth: 0 });
    const auth = await payload.find({ collection: "authors", limit: 1, depth: 0 });
    await assert.rejects(
      () =>
        make("posts", {
          title: "Test Invalid Date Post",
          slug: "test-invalid-date-post",
          date: "not-a-date",
          category: cat.docs[0].id,
          author: auth.docs[0].id,
        }),
      /Date/,
      "Payload should reject an unparseable date rather than storing it"
    );
  });

  await test("a post cannot take a subcategory from another section", async () => {
    const parent = await payload.find({
      collection: "categories",
      where: { slug: { equals: "field-inspections" } },
      limit: 1,
      depth: 0,
    });
    const auth = await payload.find({ collection: "authors", limit: 1, depth: 0 });
    if (!parent.docs[0]) return; // seed not loaded; nothing to assert against
    await assert.rejects(
      () =>
        make("posts", {
          title: "Test Mismatched Subcategory",
          slug: "test-mismatched-subcategory",
          date: new Date("2026-01-01T00:00:00Z").toISOString(),
          category: parent.docs[0].id,
          subcategory: "disaster-events", // belongs to disaster-field-alerts
          author: auth.docs[0].id,
        }),
      /Subcategory|different section/i,
      "a subcategory from another parent should fail validation"
    );
  });
} finally {
  for (const { collection, id } of created.reverse()) {
    try {
      await payload.delete({ collection: collection as never, id });
    } catch {
      console.log(`  (cleanup: could not delete ${collection}#${id})`);
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}
