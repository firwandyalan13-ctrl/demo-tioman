# WhatsApp Prefill Message Design

## Goal

Make it immediately clear to UDIVE Tioman customer service that a WhatsApp enquiry originated from the official website, while giving the visitor a natural starting point for asking about services.

## Approved Message

> Hi, I found UDIVE Tioman through your official website and would like to enquire about diving or accommodation. Could you assist me?

## Scope

- Update only the prefilled `text` parameter of the floating WhatsApp button in `Udive Homepage.html`.
- Keep the destination number as `60122459883`.
- Keep the official WhatsApp icon, green button styling, accessibility labels, and new-tab behavior unchanged.
- URL-encode the approved English message before placing it in the WhatsApp link.

## Behavior

When a visitor clicks the floating WhatsApp button, WhatsApp opens a conversation with `60122459883` and inserts the approved message into the composer. The visitor can review or edit the text before sending it.

## Validation

- The WhatsApp link points to `https://wa.me/60122459883`.
- Decoding the `text` query parameter produces the approved message exactly.
- No Instagram link or unrelated page content is changed.
