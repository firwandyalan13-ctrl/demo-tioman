# About Back Glass Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the red About-panel Back control with a dedicated glass button below the information card, then publish the change to GitHub Pages only.

**Architecture:** Keep `toggleAbout()` as the single state transition function. Add a dedicated Back button inside the About panel, bind it to the same close behavior, hide the original hero navigation while the panel is open, and remove the red active-state CSS.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, GSAP, GitHub Pages

---

### Task 1: Add the dedicated Back control

**Files:**
- Modify: `Udive Homepage.html:192-204`
- Modify: `Udive Homepage.html:1459-1544`

- [ ] **Step 1: Run the structural check before implementation**

Run:

```bash
rg -n "hero__about-back" "Udive Homepage.html"
```

Expected: no matches and exit code 1.

- [ ] **Step 2: Add the Back button below the information card**

Insert immediately after `.hero__about-inner`:

```html
<button class="hero__about-back" id="heroAboutBack" type="button">
  <span aria-hidden="true">←</span>
  <span>Back</span>
</button>
```

- [ ] **Step 3: Bind the new control to the existing toggle**

After resolving `panel`, add:

```javascript
const backBtn = document.getElementById('heroAboutBack');
if (!backBtn) return;
```

Remove both assignments that change `aboutBtn.textContent`. Add:

```javascript
backBtn.addEventListener('click', toggleAbout);
```

Keep the existing `aboutBtn` click and touch handlers unchanged.

- [ ] **Step 4: Verify the HTML and JavaScript structure**

Run:

```bash
rg -n "hero__about-back|heroAboutBack|backBtn.addEventListener" "Udive Homepage.html"
```

Expected: one button class match, one element lookup, and one click binding.

### Task 2: Apply the glass design and remove the red state

**Files:**
- Modify: `udive-styles.css:288-435`
- Modify: `Udive Homepage.html:95`

- [ ] **Step 1: Add the glass button styles**

Add after `.hero__about-inner`:

```css
.hero__about-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  margin-left: auto;
  min-height: 42px;
  padding: 0.65rem 1rem;
  color: oklch(96% 0.01 250 / 0.94);
  background: oklch(12% 0.02 250 / 0.42);
  border: 1px solid oklch(100% 0 0 / 0.18);
  border-radius: 999px;
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  box-shadow: 0 8px 28px oklch(0% 0 0 / 0.28);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.hero__about-back:hover,
.hero__about-back:focus-visible {
  background: oklch(18% 0.025 250 / 0.62);
  border-color: oklch(100% 0 0 / 0.34);
  transform: translateY(-2px);
  outline: none;
}
```

- [ ] **Step 2: Remove the red active-state rules**

Delete the open-state `.hero__ctas` repositioning, red background, border, shadow, and pseudo-element rules. Change the navigation-hiding selector to:

```css
.hero:has(.hero__about-panel.open) .hero__ctas .btn--glass,
.hero:has(.hero__event-poster.open) .hero__ctas .btn--glass:not([data-i18n="hero.event"]) {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}
```

- [ ] **Step 3: Increment the CSS cache version**

Change:

```html
<link rel="stylesheet" href="udive-styles.css?v=6">
```

to:

```html
<link rel="stylesheet" href="udive-styles.css?v=7">
```

- [ ] **Step 4: Run static verification**

Run:

```bash
git diff --check
```

Expected: exit code 0 and no output.

Run:

```bash
rg -n "hero__about-back|udive-styles.css\?v=7" "Udive Homepage.html" udive-styles.css
```

Expected: the new HTML, CSS, and cache version are present.

Run:

```bash
rg -n "background: oklch\(55% 0\.22 25 / 0\.92\)" udive-styles.css
```

Expected: no matches and exit code 1.

### Task 3: Verify and publish the GitHub preview

**Files:**
- Modify: `Udive Homepage.html`
- Modify: `udive-styles.css`

- [ ] **Step 1: Run a local HTTP preview**

Run:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/Udive%20Homepage.html`, select About Us, and verify:

- the original hero navigation is hidden;
- the Back button is below the card and right-aligned;
- the Back button uses glass styling with no red background;
- selecting Back restores the original hero.

- [ ] **Step 2: Commit the implementation**

Run:

```bash
git add "Udive Homepage.html" udive-styles.css
git commit -m "Restyle About back control as glass"
```

Expected: one implementation commit containing only the HTML and CSS changes.

- [ ] **Step 3: Push main**

Run:

```bash
git push origin main
```

Expected: `main` advances to the implementation commit.

- [ ] **Step 4: Verify GitHub Pages**

Open:

```text
https://firwandyalan13-ctrl.github.io/demo-tioman/Udive%20Homepage.html
```

Verify the live page loads `udive-styles.css?v=7` and reproduces all four checks from Step 1. Do not modify cPanel in this task.

