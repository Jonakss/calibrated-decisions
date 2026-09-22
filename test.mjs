import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

test("title names the app", () => {
    assert.match(html, /Calibrated Decisions/);
});

test("ships the three presets", () => {
    for (const preset of ["support", "prgate", "churn"]) {
        assert.match(html, new RegExp(`preset\\('${preset}'\\)`), `missing preset: ${preset}`);
    }
});

test("calls the real typed-decisions endpoint", () => {
    assert.match(html, /https:\/\/gen\.pollinations\.ai\/alpha\/decisions/);
});

test("send shape matches the API contract", () => {
    // JSON POST with Authorization + Content-Type headers
    assert.match(html, /Bearer/);
    assert.match(html, /Content-Type["'\s:]+application\/json/i);
});

test("typed question shapes are guided", () => {
    // choice = record, score = ordered rungs (array), noul = yes/no
    assert.match(html, /record/i);
    assert.match(html, /rungs?/i);
    assert.match(html, /noul/i);
});

test("the classic 400 mistake is guided UX", () => {
    assert.match(html, /expected record/i);
    assert.match(html, /collective-memory/); // link to the canonical tip
});

test("keys are bring-your-own and never persisted", () => {
    // input field asks for the caller key
    assert.match(html, /(api[-\s]?key|apikey)/i);
    // no storage of secrets
    assert.ok(!/localStorage\s*\.\s*set/i.test(html), "must not persist to localStorage");
    assert.ok(!/sessionStorage\s*\.\s*set/i.test(html), "must not persist to sessionStorage");
    assert.ok(!/document\s*\.\s*cookie\s*=/i.test(html), "must not persist to cookies");
});

test("credits Pollinations", () => {
    assert.match(html, /Powered by/i);
    assert.match(html, /pollinations\.ai/i);
});
