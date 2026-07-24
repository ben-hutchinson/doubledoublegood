# Getdown Stripe sales and door-list runbook

This is the operating checklist for the one-time Stripe Payment Link used by the homepage. Stripe is the system of record. The website does not create orders, handle cards, track stock, receive webhooks, or generate its own tickets.

## Ownership and launch rule

- The client owns the Stripe account, product, price, stock allocation, refunds, and exported attendee list.
- The public GitHub repository variable `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` must contain the approved live `https://buy.stripe.com/...` link before production is built.
- The IONOS workflow sets `ALLOW_STRIPE_TEST_PAYMENT_LINKS` only for non-default branches. This permits a Stripe sandbox link on staging while the default production branch rejects it. Do not turn this flag into a repository variable or enable it for `main`.
- Never put a Stripe secret or restricted key in GitHub repository variables, the repository, or any `NEXT_PUBLIC_*` value. A Payment Link is a public checkout destination, not an API credential.
- Do not merge this branch to `main` until the temporary Santù slide is replaced by final Getdown artwork, the live link passes the purchase/refund check, fulfilment and the stock limit are confirmed, and the client approves the policy and event wording.

## Configure the Payment Link

Create one clearly described Stripe product, such as `Getdown Services — LP`, so the payment is identifiable in the Dashboard and export.

1. Set the customer quantity to one and disable adjustable quantities.
2. Set the completed-payment or stock limit to the client’s allocated LP stock, currently expected to be 60. Confirm the final figure with the client before launch.
3. Require the purchaser’s individual name, email address, billing address, and delivery address. State that this named purchaser is the person admitted to the gig.
4. Require acceptance of the approved purchase, returns, privacy, and event-entry terms.
5. Offer `Collect from Double Double Good — free` and the client’s approved fixed UK delivery option. Confirm the displayed delivery price and estimate.
6. Enable only payment methods that confirm immediately for event admission. Disable delayed or asynchronous methods where Stripe permits.
7. Enable successful-payment email receipts. The successful, non-refunded Stripe receipt is the customer’s ticket.
8. Configure the post-payment message to repeat the collection/delivery choice, named-entry rule, receipt requirement, shop location, and approved event date/time.

When the link reaches its cap, Stripe’s inactive page is the overselling control. Deactivate the link manually if sales must stop sooner. The static homepage can still show an active button until its copy is changed and redeployed.

Fixed quantity one limits each Checkout session, but it does not guarantee that the same person cannot complete the Payment Link more than once. Review duplicate names, emails, and addresses before the event and resolve them under the client’s approved policy.

## Sandbox acceptance

The client has confirmed one successful manual test-mode Checkout using Stripe’s hosted page and a test card. The following checks still need to be completed and recorded:

- [ ] The Dashboard shows the correct LP product, amount, successful status, and date.
- [ ] Purchaser name, email, billing/delivery address, and fulfilment choice are present.
- [ ] The payment reference and receipt details are usable for admission.
- [ ] A successful-payment receipt reaches an email address verified for the Stripe team.
- [ ] An inactive or capped test link refuses another payment safely.
- [ ] A **Payments** CSV contains the fields required for the door list.

Export the test CSV from **Payments**, not Customers. One-time Payment Links may create guest customers, so the Customers export is not a complete door list. If the Payments CSV contains every required field, do not add custom export code. Consider a script only if this test proves that a required field is unavailable.

## Live-mode acceptance

Before launch, make and then refund one low-value live purchase through the link. Confirm:

- the homepage button opens the intended live product in the same tab;
- product, contact details, address, and fulfilment choice reach Stripe;
- the receipt reaches the purchaser and has a usable receipt or payment reference;
- the payment appears in the Payments export; and
- the refund returns through Stripe and the refunded payment can be excluded from admission.

Do not use the client’s real inventory allocation for the test unless it is restored after the refund.

## Door-list export

Shortly before the event, export successful payments from Stripe **Payments** for the sales window. Include, where available:

- payment date and status;
- refunded status;
- product or description;
- purchaser name;
- email address;
- billing/delivery address;
- payment reference; and
- receipt number.

Filter the working list to successful, non-refunded LP payments. Add an `Admitted` column without overwriting the original export. Sort by purchaser name and retain the payment reference for tie-breaking.

Review possible duplicates across name, email, and address. Resolve suspected repeat purchases with the client and refund only under the approved policy; do not silently delete a successful payment from the list.

Export once in advance for preparation, then refresh immediately before doors. Keep a printed backup in case connectivity fails. At entry, staff match the attendee’s name and successful receipt against the list and mark the admission as used.

## Exceptions and support

- **Refunded or disputed payment:** no admission unless the client resolves the payment and records the decision.
- **Receipt not received:** search Payments by name/email and verify the successful, non-refunded payment reference before admitting.
- **Different attendee name:** the named purchaser is valid by default; any transfer needs an explicit client decision and a note on the door list.
- **Delivery customer at the gig:** admission depends on the qualifying payment, not collection status.
- **Gig cancellation or reschedule:** follow the client-approved event and consumer-rights wording; preserve the original transaction and communications.
- **Stripe outage:** leave the informational homepage available. Do not collect card details or build a fallback payment form. The Stripe link can be deactivated independently of the website.
- **Homepage regression:** revert the feature commit through the normal Git/GitHub workflow. The Payment Link and payments remain available in the Stripe Dashboard.

## Final production checklist

- [x] Final second Getdown image and accurate alt text replace the Santù staging slide.
- [ ] `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` contains the approved live link and not a sandbox (`/test_...`) link.
- [ ] The LP product, description, price, fulfilment choices, and stock limit are correct.
- [ ] The client approves Delivery & Returns, Privacy, and the effect of a product cancellation, return, or refund on unused or already-used free admission.
- [ ] Outstanding sandbox receipt, inactive-link, and Payments CSV checks pass.
- [ ] The low-value live purchase, receipt, CSV fields, and refund pass.
- [ ] Desktop and mobile staging show the correct artwork, singular note, one purchase button, and destination without console errors.
- [ ] Only after every item above passes, merge to `main` so the normal GitHub Actions build publishes `out` to IONOS.
