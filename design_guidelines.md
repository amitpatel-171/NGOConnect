# NGO Website Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with Trust-Building Focus

Drawing inspiration from successful non-profit platforms (Charity: Water, UNICEF, Red Cross) while incorporating modern SaaS clarity for donation flows. The design prioritizes emotional connection, credibility, and clear calls-to-action to drive donations and volunteer engagement.

**Core Principles:**
- Warmth and Professionalism: Balance approachability with institutional trust
- Impact-First: Visual hierarchy emphasizes measurable outcomes and stories
- Frictionless Giving: Donation and volunteer CTAs are prominent and accessible
- Authentic Imagery: Real people and real impact over stock photography

---

## Typography

**Font Families:**
- Headlines: Inter or Poppins (600-700 weight) - modern, trustworthy
- Body: Inter or system font stack (400-500 weight) - highly readable
- Accent/Stats: Poppins (700-800 weight) - for impact numbers

**Hierarchy:**
- Hero Headline: text-5xl md:text-7xl font-bold
- Section Titles: text-3xl md:text-4xl font-semibold
- Subsection Headers: text-xl md:text-2xl font-semibold
- Body Text: text-base md:text-lg leading-relaxed
- Small Print/Captions: text-sm
- Impact Stats: text-4xl md:text-6xl font-extrabold

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, gap-8, py-16, etc.)

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl mx-auto px-6 lg:px-8
- Content sections: max-w-6xl mx-auto
- Text-focused areas: max-w-4xl mx-auto
- Cards/Components: p-6 to p-8

**Vertical Rhythm:**
- Section padding: py-16 md:py-24 for major sections
- Component spacing: space-y-12 md:space-y-16 between major blocks
- Card/component internal: p-6 md:p-8

---

## Component Library

### Navigation
- Sticky header with backdrop-blur
- Logo left, navigation center/right
- "Donate Now" CTA button prominently displayed (distinct styling)
- Mobile: Hamburger menu with slide-in drawer
- Include user auth state indicator (avatar/login button)

### Hero Section (Home)
- Full-height or 80vh hero with large background image
- Overlay gradient for text readability
- Centered content: headline + subheadline + dual CTAs ("Donate" + "Become a Volunteer")
- Floating stat cards at bottom: "5,000+ Lives Changed" | "200+ Volunteers" | "$500K+ Raised"
- Buttons on hero: backdrop-blur-md bg-white/20 with border

### Impact Stats Section
- 3-4 column grid (grid-cols-1 md:grid-cols-3 lg:grid-cols-4)
- Each stat: Large number + icon + description
- Centered alignment with ample padding (p-8)

### Event Cards
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure: Image top (aspect-video), content below
- Include: event image, date badge (absolute positioning), title, short description, "Register" CTA
- Card styling: rounded-xl, subtle shadow, hover lift effect

### Donation Components
- Progress Bar: Prominent display showing goal vs. raised (h-4 rounded-full)
- Donation Form: Clean, stepped layout with amount selection tiles
- Impact Calculator: "Your $50 provides X meals" messaging
- Payment integration: Razorpay modal trigger with clear security badges

### Team/About Section
- Team grid: 3-4 columns on desktop
- Circular or rounded-square avatars (w-32 h-32 to w-48 h-48)
- Name, role, short bio below each
- Mission/Vision: Two-column layout with icon accents

### Volunteer Section
- Application form: Single column, max-w-2xl, clearly labeled fields
- Include: Why volunteer (3-4 benefit cards), volunteer testimonials
- Approval status indicator for logged-in volunteers

### User Dashboard
- Sidebar navigation (desktop) / top tabs (mobile)
- Dashboard cards: Donation history table, registered events list, profile settings
- Quick actions panel: "Register for Event" + "Make a Donation"

### Admin Panel
- Data-dense tables with sorting/filtering
- Stat cards at top: Total users, total donations, active events
- Export buttons, action modals for CRUD operations
- Sidebar with clear navigation sections

### Contact Page
- Two-column layout: Form (60%) + Contact info/Map (40%)
- Form: Standard fields with clear labels and spacing (space-y-4)
- Include social media icon links, office hours, response time estimate

### Footer
- Multi-column layout: About (brief), Quick links, Contact info, Newsletter signup
- Social media icons (Heroicons or Font Awesome)
- Trust badges: "Registered NGO" + Payment security indicators
- Copyright and privacy policy links

### Forms & Inputs
- Input fields: p-3 rounded-lg border, focus:ring-2 state
- Labels: text-sm font-medium mb-2
- Error states: border-red-500 with text-red-600 message below
- Success states: border-green-500 with checkmark icon
- Buttons: Primary (filled), Secondary (outlined), Tertiary (text only)

### Cards & Containers
- Standard card: rounded-xl p-6 shadow-sm border
- Elevated card: shadow-md hover:shadow-lg transition
- Image cards: overflow-hidden rounded-xl with aspect ratio containers

---

## Images Strategy

**Hero Section:**
- Large hero image: Community/volunteers in action, authentic moments of impact
- Placement: Full-width background with overlay gradient
- Format: High-quality, aspect-21/9 or taller

**Event Listings:**
- Individual event images: aspect-video (16:9) format
- Show actual events, volunteers, beneficiaries

**About/Team Section:**
- Team member photos: Professional headshots, circular crops
- Behind-the-scenes candid shots of team working

**Impact Stories:**
- Before/after comparisons where applicable
- Beneficiary testimonials with photos (with consent messaging)

**Volunteer Section:**
- Grid of volunteer activities: 2x2 or 3x3 photo collage
- Action shots showing volunteers engaged

**General Approach:**
- Use authentic photography over stock images
- Ensure diverse, inclusive representation
- All images: optimized for web, lazy loading
- Image placeholders during load: subtle gradient backgrounds

---

## Accessibility & Polish
- Minimum contrast ratios: WCAG AA standard
- Focus indicators: visible on all interactive elements
- Alt text: descriptive for all images
- Form validation: inline, immediate feedback
- Loading states: skeleton screens for content, spinners for actions
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Smooth scroll behavior for in-page navigation

**Icon Library:** Heroicons (via CDN) for consistency throughout