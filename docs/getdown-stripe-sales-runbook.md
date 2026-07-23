# Getdown Stripe sales and door-list runbook

This is the operating checklist for the two one-time Stripe Payment Links used by the homepage. Stripe is the system of record. The website does not create orders, handle cards, track stock, receive webhooks, or generate its own tickets.

## Ownership and launch rule

- The client owns the Stripe account, products, prices, stock allocation, refunds, and exported attendee list.
- The two public GitHub repository variables are `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` and `NEXT_PUBLIC_STRIPE_LP_CD_PAYMENT_LINK`. They must contain live `https://buy.stripe.com/...` links before production is built.
- Never put a Stripe secret or restricted key in GitHub repository variables, the repository, or any `NEXT_PUBLIC_*` value.
- Do not merge this branch to `main` until the temporary Santù slide is replaced by final Getdown artwork, both live links pass purchase/refund checks, fulfilment and limits are confirmed, and the client approves the policy and event wording.

## Configure each Payment Link

Create distinct Stripe products and links so exports clearly distinguish `Getdown Services — LP` from `Getdown Services — LP + CD`.

For both links:

1. Set the customer quantity to one and disable adjustable quantities.
2. Set the link's completed-payment or stock limit to the number allocated to that option. If both options draw from the same stock of 60 LPs, allocate the 60 between the links so the two limits cannot total more than the stock actually available; Stripe does not share a stock counter between separate Payment Links.
3. Require the purchaser's individual name, email address, billing address, and delivery address. Make clear that this named purchaser is the person admitted to the gig.
4. Require acceptance of the approved purchase, returns, privacy, and event-entry terms.
5. Offer `Collect from Double Double Good — free` and the client's approved fixed UK delivery option. Confirm the price and delivery estimate displayed by Stripe.
6. Enable only payment methods that confirm immediately for event admission. Disable delayed or asynchronous methods where Stripe permits.
7. Enable successful-payment email receipts. The successful, non-refunded Stripe receipt is the customer's ticket.
8. Configure the post-payment message to repeat the collection/delivery choice, named-entry rule, receipt requirement, shop location, and event date/time once those details are approved.

When a link reaches its cap, Stripe's inactive page is the overselling control. Deactivate either link manually if sales must stop sooner. The static homepage can still show an active button until its copy is changed and redeployed.

## Sandbox acceptance

Complete one Stripe test-mode checkout through each Payment Link and confirm the Dashboard records:

- the correct LP or LP + CD product and amount;
- successful payment status and date;
- purchaser name and email;
- billing/delivery address;
- collection or UK delivery choice;
- payment reference; and
- receipt details where Stripe makes them available.

Automatic test-mode receipts are normally restricted by Stripe, so use an email address verified for the Stripe team when checking receipt delivery. Confirm an inactive or capped test link refuses another payment safely.

Export a test CSV from **Payments**, not Customers. One-time Payment Links may create guest customers, so the Customers export is not a complete door list. If the Payments CSV contains every required field, do not add custom export code. Consider a script only if the sandbox export proves that a required field is unavailable.

## Live-mode acceptance

Before launch, make and then refund one low-value live purchase through each link. Confirm:

- each homepage button opens the intended live product in the same tab;
- the product, contact details, address, and fulfilment choice reach Stripe;
- the receipt reaches the purchaser and has a usable receipt/payment reference;
- the payment appears in the Payments export; and
- the refund returns through Stripe and the refunded payment can be excluded from admission.

Do not use the client's real inventory allocation for test transactions unless it is restored after the refund.

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

Filter the working list to successful, non-refunded LP and LP + CD payments. Add an `Admitted` column without overwriting the original export. Sort by purchaser name and retain the payment reference for tie-breaking.

Stripe cannot prevent the same person buying once through each link. Before doors, review duplicates across name, email, and address. Resolve suspected duplicates with the client and refund only under the approved policy; do not silently delete a successful payment from the list.

Export once in advance for preparation, then refresh immediately before doors. Keep a printed backup in case connectivity fails. At entry, staff match the attendee's name and successful receipt against the list and mark the admission as used.

## Exceptions and support

- **Refunded or disputed payment:** no admission unless the client resolves the payment and records the decision.
- **Receipt not received:** search Payments by name/email and verify the successful, non-refunded payment reference before admitting.
- **Different attendee name:** the named purchaser is valid by default; any transfer needs an explicit client decision and a note on the door list.
- **Delivery customer at the gig:** admission depends on the qualifying payment, not collection status.
- **Gig cancellation or reschedule:** follow the client-approved event and consumer-rights wording; preserve the original transaction and communications.
- **Stripe outage:** leave the informational homepage available. Do not collect card details or build a fallback payment form. Stripe links can be deactivated independently of the website.
- **Homepage regression:** revert the feature commit through the normal Git/GitHub workflow. Stripe links and payments remain available in the Stripe Dashboard.

## Final production checklist

- [ ] Final second Getdown image and accurate alt text replace the Santù staging slide.
- [ ] Both GitHub variables contain live links and no sandbox (`/test_...`) link.
- [ ] LP and LP + CD products, descriptions, prices, fulfilment choices, and allocated limits are correct.
- [ ] The client approves Delivery & Returns, Privacy, and the effect of a product cancellation/return/refund on unused or already-used free admission.
- [ ] Sandbox checkout, receipt, inactive-link, and Payments CSV checks pass.
- [ ] Low-value live purchases, receipts, CSV fields, and refunds pass for both links.
- [ ] Desktop and mobile staging show the correct artwork, note, policy links, controls, and destinations without console errors.
- [ ] Only after every item above passes, merge to `main` so the normal GitHub Actions build publishes `out` to IONOS.
