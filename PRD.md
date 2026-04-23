PRD.md
Product Overview

Build a modern static website for Double Double Good Music Emporium to replace the legacy WordPress site and improve brand presence, local discovery, and in-store visits.

Goals
Modernize online presence
Increase awareness in Stafford and surrounding areas
Encourage store visits
Direct users to social channels
Create a scalable foundation for future ecommerce
Audience
Local vinyl buyers
Music enthusiasts visiting Stafford
Sellers with records/collections
Existing customers seeking hours/location/contact info
Tech Stack
Next.js App Router
TypeScript
React
Tailwind CSS
IONOS Deploy Now
Pages
Home
Header with clickable logo + nav
Hero headline: "Stafford's Independent Record Shop"
Main "What we do" content block covering stock and buying
Featured shopfront image panel
Embedded "New stock" Instagram reel panel
Social links in header
Footer with delivery/returns link, privacy policy link, newsletter signup, and repeated footer nav
About
Shop story
Founded from a market stall in 2019
Moved to Mill Street, then to the current Ancient High House location
Owner section with supporting image
Owner bio copy can remain temporary until final approved text is supplied
Find Us
Address: 49 Greengate Street, Stafford, ST16 2JA
Embedded Google Map
"Get directions" button
Opening hours displayed in global footer
Parking guidance: local to any Stafford Town Centre car park
5 minute walk from Stafford train station or bus station
Sell
Present owner-approved copy and buying categories
Keep page focused on simple guidance for bringing records in and making contact
Contact
Phone: 01785 562657
Email: thedoublegood@gmail.com
Contact form with fields: name, email, phone (optional), message
Form submits to the Formspree endpoint configured in site content and delivers enquiries to the shop inbox
Success message: "Thanks, we'll get back to you soon"
Preferred response via email/form
Reviews
Google Reviews widget/embed

## Reviews Integration

The Reviews page must display a live embedded Google Reviews widget using a provider selected during implementation. The solution should prioritize reliability, responsive performance, minimal visual branding, and easy maintenance. The "Leave a review" action is provided within the embedded widget itself. If the widget provider changes in future, keep the page layout stable and preserve an obvious review action.
Delivery & Returns
Static policy page
Informational only for V1
Shipping guidance (future-ready)
Returns process
Privacy Policy
Static page covering contact form data collection and processing
Functional Requirements
Responsive design mobile/tablet/desktop
Reusable header/footer
Accessible navigation
Fast load times
SEO-ready metadata
Contact form validation
Clean URL structure
Stacked visible links on mobile
Placeholder imagery where final photography is not yet available
Non-Functional Requirements
Simple maintainable code
Readable components
Easy future expansion to ecommerce
Lighthouse-focused performance
Future Roadmap
Ecommerce storefront
Stock database
Admin uploads
Checkout flow
Inventory management
