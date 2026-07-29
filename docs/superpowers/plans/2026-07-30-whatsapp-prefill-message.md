# WhatsApp Prefill Message Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating WhatsApp button's current Chinese prefilled text with the approved English customer-service enquiry.

**Architecture:** Keep the existing static HTML implementation and modify only the `text` query parameter in the existing `wa.me` URL. Preserve the destination number, WhatsApp icon markup, accessibility attributes, official green styling, and all unrelated page content.

**Tech Stack:** Static HTML, URL encoding, Node.js validation

---

## File Structure

- Modify: `Udive Homepage.html` — contains the floating WhatsApp link and its prefilled message.
- Preserve: `udive-styles.css` — already contains the approved official WhatsApp green styling; no changes required.

### Task 1: Replace and validate the WhatsApp prefilled message

**Files:**
- Modify: `Udive Homepage.html:908`

- [ ] **Step 1: Run the pre-change assertion and verify it fails**

Run from the repository root:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('Udive Homepage.html','utf8');const m=h.match(/https:\/\/wa\.me\/60122459883\?text=([^\"&]+)/);if(!m)throw new Error('WhatsApp link not found');const expected='Hi, I found UDIVE Tioman through your official website and would like to enquire about diving or accommodation. Could you assist me?';if(decodeURIComponent(m[1])!==expected)throw new Error('Approved prefill message is not installed');"
```

Expected: FAIL with `Approved prefill message is not installed`.

- [ ] **Step 2: Replace the existing WhatsApp URL**

In `Udive Homepage.html`, replace the current floating-button `href` with this exact value:

```html
<a href="https://wa.me/60122459883?text=Hi%2C%20I%20found%20UDIVE%20Tioman%20through%20your%20official%20website%20and%20would%20like%20to%20enquire%20about%20diving%20or%20accommodation.%20Could%20you%20assist%20me%3F" class="wa-float" target="_blank" rel="noopener" title="Message on WhatsApp" aria-label="Message on WhatsApp">
```

Do not modify the SVG, phone number, attributes, CSS, or surrounding markup.

- [ ] **Step 3: Run the assertion and verify it passes**

Run:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('Udive Homepage.html','utf8');const links=[...h.matchAll(/https:\/\/wa\.me\/60122459883\?text=([^\"&]+)/g)];if(links.length!==1)throw new Error('Expected exactly one floating WhatsApp link');const expected='Hi, I found UDIVE Tioman through your official website and would like to enquire about diving or accommodation. Could you assist me?';if(decodeURIComponent(links[0][1])!==expected)throw new Error('Prefill message mismatch');console.log('WhatsApp prefill verified');"
```

Expected: PASS with `WhatsApp prefill verified`.

- [ ] **Step 4: Confirm unrelated WhatsApp presentation remains intact**

Run:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('Udive Homepage.html','utf8');const css=fs.readFileSync('udive-styles.css','utf8');if(!h.includes('aria-label="Message on WhatsApp"'))throw new Error('Accessibility label changed');if(!css.includes('background:#25D366'))throw new Error('Official WhatsApp green missing');console.log('WhatsApp presentation preserved');"
```

Expected: PASS with `WhatsApp presentation preserved`.

- [ ] **Step 5: Commit the focused change**

```bash
git add "Udive Homepage.html"
git commit -m "Update WhatsApp prefill message"
```
