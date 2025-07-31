Cargovibe Case Study

Approach

I started by focusing on the core user flow—translating that voice command into actionable data. I built a simple text parser first (since voice API was not an option due to time constraints), then mocked up parking spot data to test the filtering logic. The UI came together last, keeping it minimal but functional.

What worked & what sucked

The filtering logic and reservation flow felt solid—TypeScript caught my dumb mistakes early. But, that command parser was trickier than expected! Real-world phrases like "along my route to Munich" made me realize how fragile regex can be (but i believe wisper api would do all the hardwork recognizing command and return text). I got it working for the demo, but it's not production-ready.

With more time...

I'd swap that text input for real voice commands (integrate Whisper AI). Also I would love to add a tiny map preview showing spots along the route. And proper loading states! Right now it feels a bit rough when results pop in but works for a demo.

Questions I'd ask the team

When drivers say "on the way to Munich", how critical is exact route accuracy vs. general direction?

Should we show "almost full" spots when nothing's available? Drivers might risk it.

What's the nightmare scenario we absolutely must prevent? (Wrong location? Overbooking?)

This was fun! Felt like solving a real puzzle—especially balancing legal constraints with driver urgency. Curious what you'd tweak first if we built this for real.

