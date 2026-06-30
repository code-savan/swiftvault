# SwiftVault — Project Goals

## Vision

To become Nigeria's all-in-one digital vault — a single platform where Nigerians access global digital services that are otherwise locked behind payment barriers, geographic restrictions, and technical complexity. Everything billed in Naira. Everything in one wallet.

---

## Core Offering (Current)

### OTP Verification Platform
- Virtual phone numbers from 150+ countries for instant OTP verification
- Paystack wallet funded in NGN — no international card needed
- Echo Numbers: persistent Twilio numbers with SMS forwarding
- Referral/influencer system with commission tracking
- Admin dashboard for platform management

**Status:** MVP built. Core OTP flow + payments functional. ~50% production-ready.

**Immediate priority:** Remove all hardcoded/mock data, fix security vulnerabilities, complete the wallet and transaction pages, then launch.

---

## Expanded Vision: The Vault

SwiftVault evolves from an OTP platform into a **digital services vault** — a bundle of tools, access, and infrastructure that Nigerians can't easily get on their own.

The pattern is simple:
1. Service exists globally but is hard for Nigerians to access
2. SwiftVault provides a bridge
3. Users pay in Naira via the wallet
4. We take a margin on the convenience

---

## Revenue Models

### Model 1: OTP Verification (Current)

- **How:** Users buy disposable phone numbers, receive OTPs, pay per number
- **Pricing:** ₦1,200-7,000 per number depending on country/service
- **Margin:** 15-25% on SMS-Activate costs
- **Revenue type:** Transactional (per-use)
- **Target:** ₦50M ARR by Month 12 (conservative)

### Model 2: AI Access Vault

- **How:** One subscription gives access to ChatGPT Plus, Claude Pro, Midjourney, Gemini Advanced — all billed in Naira
- **Pricing:** ₦10,000-15,000/month per user
- **Margin:** 40-60% after API costs
- **Revenue type:** Recurring (monthly subscription)
- **Target:** ₦240M ARR by Month 12 (conservative)

### Model 3: Virtual Dollar Cards

- **How:** Issue virtual Visa/Mastercard dollar cards funded with Naira. Users pay for international subscriptions (Netflix, Spotify, Adobe, SaaS tools)
- **Pricing:** ₦1,000 card issuance + ₦500/month maintenance + 4-6% FX spread
- **Margin:** 3-8% on FX spread + fixed fees
- **Revenue type:** Recurring (monthly loads + maintenance) + transactional (FX)
- **Target:** ₦432M ARR by Month 12 (conservative)

### Model 4: Digital Residency + Proxy Services

- **How:** US/UK phone numbers, virtual mailing addresses, residential proxy IPs — a complete digital identity package for accessing geo-restricted services
- **Pricing:** ₦15,000/month per user (bundled)
- **Margin:** 55-70%
- **Revenue type:** Recurring (monthly subscription)
- **Target:** ₦270M ARR by Month 12 (conservative)

### Model 5: Creator Economy Toolkit

- **How:** Bundled SaaS access for Nigerian content creators — Canva Pro, CapCut Pro, Midjourney (thumbnails), stock assets, AI caption tools — unified dashboard
- **Pricing:** ₦5,000/mo (Starter), ₦12,000/mo (Pro), ₦25,000/mo (Agency)
- **Margin:** 35-50%
- **Revenue type:** Recurring (monthly subscription)
- **Target:** ₦288M ARR by Month 12 (conservative)

### Model 6: Developer API Marketplace

- **How:** Nigerian developers buy API credits in Naira to access AI models, payment processing, SMS, and data APIs. Third-party developers can list their own APIs.
- **Pricing:** Pay-per-call with margin, + marketplace listing fees
- **Margin:** 25-40%
- **Revenue type:** Transactional (per-use) + platform fees
- **Target:** ₦150M ARR by Month 12 (conservative)

---

## Revenue Summary (Month 12 Projections)

| Model | Conservative ARR | Aggressive ARR | Type |
|-------|------------------|----------------|------|
| OTP Verification | ₦50M | ₦200M | Transactional |
| AI Access Vault | ₦240M | ₦1.44B | Recurring |
| Virtual Dollar Cards | ₦432M | ₦1.94B | Recurring + FX |
| Digital Residency | ₦270M | ₦1.92B | Recurring |
| Creator Toolkit | ₦288M | ₦1.8B | Recurring |
| Developer API | ₦150M | ₦1.44B | Transactional |
| **Total** | **₦1.43B** | **₦8.74B** | |

**Target mix:** 70% recurring revenue, 30% transactional by Month 12.

---

## The Wallet Is the Platform

Every revenue model routes through the SwiftVault wallet. Users fund once in Naira, spend across all services. The wallet is the core infrastructure. Everything else is a service on top of it.

This creates:
- **Lock-in:** Users with ₦50,000 in their wallet are not switching to a competitor
- **Cross-sell:** OTP users see AI tools → AI users see virtual cards → everyone sees the creator toolkit
- **Float revenue:** Pre-funded wallets generate interest income
- **Data:** Wallet spending patterns reveal what Nigerians value most

---

## Build Order (12-Month Roadmap)

### Phase 1: Foundation (Month 1-2)
- Remove all hardcoded/mock data
- Fix security vulnerabilities (4 critical issues)
- Database transactions for wallet operations
- Server-side price validation
- Complete wallet page, transactions page, settings page
- Forgot Password flow
- Loading states and error boundaries
- Multi-provider SMS fallback (add 5sim)

### Phase 2: AI Vault + Launch (Month 2-4)
- AI Access Vault (ChatGPT, Claude, Midjourney bundle)
- Subscription tier ("SwiftVault Pro")
- Service-specific landing pages (10 pages for SEO)
- WhatsApp share flow + referral visibility
- Blog content (15 SEO articles)
- Official launch

### Phase 3: Payments + Residency (Month 4-6)
- Virtual Dollar Cards (partner with BIN sponsor)
- Digital Residency bundle (US numbers, addresses, proxies)
- Dynamic/surge pricing for OTP
- Volume discounts and loyalty tiers

### Phase 4: Creator + Developer (Month 6-10)
- Creator Economy Toolkit (bundled SaaS for creators)
- Developer API Marketplace
- PWA + mobile app
- Push notifications (browser + WhatsApp)

### Phase 5: Scale + Fundraise (Month 10-12)
- Multi-admin system with role-based access
- Comprehensive analytics dashboard
- Compliance documentation
- Pitch deck + financial model
- Investor outreach

---

## Key Metrics to Track

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Registered users | 5,000 | 20,000 | 100,000 |
| Monthly active users | 2,000 | 10,000 | 50,000 |
| MRR | ₦10M | ₦50M | ₦120M |
| Wallet balance (float) | ₦5M | ₦30M | ₦150M |
| Repeat purchase rate | 20% | 35% | 50% |
| Referral-driven signups | 10% | 25% | 40% |
| Churn rate | 15% | 10% | 7% |

---

## Competitive Moat

1. **Naira-native pricing** — competitors price in USD. We price in NGN.
2. **Wallet lock-in** — pre-funded wallets create switching costs
3. **Bundle effect** — no single competitor offers OTP + AI + cards + residency + creator tools
4. **Local trust** — WhatsApp support, Nigerian brand, local payment rails
5. **Data advantage** — spending patterns across all services inform product decisions

---

## Risks to Monitor

| Risk | Impact | Mitigation |
|------|--------|------------|
| CBN regulatory action on virtual cards | High | Legal counsel, compliance posture, diversify revenue |
| SMS-Activate API disruption | High | Multi-provider fallback (5sim, Grizzly SMS) |
| AI provider ToS changes (shared accounts) | Medium | Use API-based access where possible, enterprise plans |
| Naira volatility eating FX margins | Medium | Hedge USD exposure, adjust pricing weekly |
| Competitor builds bundled platform | Medium | Move fast, build community, lock in users with wallet |
| Platform bans (WhatsApp, etc.) | Low-Med | Position as "digital residency for remote workers" |

---

## Success Definition

**By Month 12, SwiftVault is successful if:**
- ₦100M+ MRR across all revenue models
- 50,000+ monthly active users
- 70%+ recurring revenue
- 5+ revenue streams active
- Brand recognized as the go-to digital services platform in Nigeria
- Funded or profitable (ideally both)
