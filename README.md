# ButterAI

> AI voice agent for instant customer follow-up and lead qualification

**Built with:** n8n, Claude API, Voice AI integration, Airtable

---

## What It Does

ButterAI is an AI voice agent that eliminates the #1 reason service businesses lose customers: delayed response times. When a customer submits a service request or their contract is up for renewal, ButterAI calls them back within seconds, confirms their needs, gathers critical details, and hands them off to a human—all before they have time to call a competitor.

**The problem:** Service requests sit in queues for hours or days. By the time someone follows up, the customer has already moved on. Speed-to-lead is everything, and most small businesses can't afford 24/7 coverage.

**The solution:** ButterAI responds instantly to form submissions, emergency requests, and renewal opportunities with natural voice conversations that feel human, gather the right information, and create urgency for immediate scheduling.

---

## Why I Built This

After interviewing a local HVAC company, I learned that the biggest bottleneck wasn't their service quality—it was response speed. Customers who submit service requests expect immediate follow-up. If they don't get it, they call the next company on Google.

Traditional solutions:
- ❌ Answering services are expensive and generic
- ❌ Automated emails get ignored
- ❌ SMS responses lack the personal touch

ButterAI bridges the gap: **instant response + personal conversation + warm handoff to human.**

---

## Current Use Case: HVAC Lead Follow-Up

ButterAI was built for service businesses like HVAC companies that need to:
- **Respond to cold leads instantly** ("I saw you requested a quote for X, I have a few follow-up questions")
- **Handle after-hours emergency calls** (service request → text dispatch → immediate callback)
- **Convert maintenance contracts** ("You've done service with us before—time for your spring tune-up")
- **Qualify installation requests** (gather home size, equipment age, HVAC tonnage before scheduling)

---

## Demo & Pitch

**The pitch to service businesses:**

> "Imagine a customer submits a service request at 8pm. Instead of that sitting in a queue until tomorrow morning, which is where you lose people, ButterAI calls them back in 30 seconds, confirms their needs, gathers the details, and hands them off to your team within a minute. The #1 reason customers churn is feeling ignored. Speed-to-lead is the whole game."

---

## How It Works

### Conversation Flow

**Step 1: Trigger**
- Form submission (service request, quote request, emergency)
- Contract renewal reminder
- Seasonal maintenance campaign trigger

**Step 2: Instant Callback**
- ButterAI calls the customer within 30 seconds
- Natural voice introduction: "Hi, this is the AI assistant from [Company]. I saw you requested a quote for..."

**Step 3: Qualification Questions**
For HVAC example:
- "What's the size of your house?"
- "What's the make and model of your current unit?"
- "How old is your equipment?"

**Step 4: Scheduling**
- "Based on these details, we'd like to book a meeting between [time range]. What's your availability?"
- "We can schedule your appointment for Saturday at 2pm. The visit will last about an hour."

**Step 5: Handoff**
- Creates detailed record in CRM
- Dispatches to appropriate technician
- Sends confirmation to customer

---

## n8n Workflows

<img width="1686" height="440" alt="image" src="https://github.com/user-attachments/assets/1f49399c-93ed-4572-aee8-d3b440a200c3" />

### Lead Follow-Up Workflow

**Flow:**
1. Form submission webhook triggers workflow
2. Customer data extracted and validated
3. Voice AI agent initiated with context
4. Conversation transcript captured
5. Lead details saved to Airtable
6. Dispatch notification sent to team

---

## Tech Stack

- **Voice AI:** Real-time speech-to-text and text-to-speech
- **Orchestration:** n8n workflows for call routing and logic
- **AI Processing:** Claude API for conversation intelligence
- **Data Storage:** Airtable for lead tracking and dispatch
- **Integrations:** CRM, calendar booking, SMS, email

---

## Key Features

- **Instant response** - Calls back in <0 seconds
- **Natural conversation** - Doesn't sound like a robot
- **Context-aware** - References customer history and service type
- **Handles interruptions** - "Wait, I meant..." works naturally
- **Qualification logic** - Asks the right follow-up questions
- **Calendar integration** - Books appointments in real-time
- **Warm handoff** - Provides full context t3o human team

---

## Metrics & Impact

**Target outcomes for service businesses:**
- Reduce response time from hours → seconds
- Increase lead-to-appointment conversion by 40%+
- Enable 24/7 coverage without hiring staff
- Qualify leads before human contact (save tech time)
- Reduce customer churn from slow follow-up

---

## What I Learned

- **Voice UX is different than text** - What reads well often sounds robotic when spoken
- **Speed > perfection** - Customers tolerate minor errors but not latency
- **Context is memory** - The agent needs to know what "it" or "that" refers to
- **Interruptions are features** - Good voice AI should handle "wait, no, I meant..." gracefully
- **Anti-churn is speed** - The #1 reason customers leave is feeling ignored

---

## Market Applications

While built for HVAC, ButterAI's instant follow-up model applies to any service business:
- **Home services:** Plumbing, electrical, roofing, landscaping
- **Professional services:** Legal, accounting, consulting intake
- **Healthcare:** Appointment scheduling, insurance verification
- **Real estate:** Property inquiry follow-up, showing scheduling
- **Automotive:** Service appointment booking, repair follow-up

---

## PMF Research & Customer Discovery

During customer discovery (21+ interviews), I validated:

**Key insights:**
- Service businesses lose 50%+ of leads due to delayed response
- After-hours requests are the highest intent but hardest to capture
- Generic answering services don't qualify leads properly
- Business owners want automation but fear losing the personal touch

**ICP (Ideal Customer Profile):**
- Service businesses with 1-20 employees
- High volume of inbound requests (calls, forms, texts)
- Seasonal demand spikes (HVAC, landscaping, tax prep)
- No dedicated call center or answering service
- High customer acquisition cost

---

## Roadmap

**Current (Prototype):**
- ✅ Basic voice conversation
- ✅ HVAC qualification questions
- ✅ Calendar integration
- ✅ CRM handoff

**Next (MVP):**
- [ ] Multi-industry templates (plumbing, electrical, legal)
- [ ] Voice analytics and call quality monitoring
- [ ] Multi-language support
- [ ] Custom question builder for different services

**Future:**
- [ ] Proactive outbound campaigns (renewal reminders)
- [ ] Integration with major scheduling platforms (Calendly, Housecall Pro)
- [ ] Mobile app for on-the-go dispatch

---

## Status

Currently in prototype phase with initial customer feedback from HVAC company pilot. Testing conversation flows and qualification logic.

**Next milestone:** Close first paying customer and validate 24/7 lead coverage model.

---

**Want to learn more?** Reach out on [LinkedIn](https://www.linkedin.com/in/brianmathewjoseph/) or email me at josephbrian671@gmail.com
