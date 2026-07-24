// The Steady help library: real loops, in the sufferer's own words.
// Content rules: warm plain English, no clinical overclaiming.
// Steady is a practice companion, never treatment, therapy, or diagnosis.

export type HelpSection = { title: string; paras: string[] };

export type HelpTopic = {
  slug: string;
  kicker: string;
  h1: string;
  short: string;
  metaTitle: string;
  metaDescription: string;
  photo: string;
  photoAlt: string;
  intro: string[];
  loop: HelpSection;
  avoidance: HelpSection;
  practice: HelpSection;
  firstStep: HelpSection;
  also: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const topics: HelpTopic[] = [
  {
    slug: "driving-anxiety-motorways",
    kicker: "Driving anxiety",
    h1: "Motorways make me panic and I've started avoiding them",
    short: "The white-knuckle merge, the exit-counting, the long way round that keeps getting longer.",
    metaTitle: "Motorway Driving Anxiety: Why Avoiding It Grows It, and What to Practice",
    metaDescription:
      "Panic on motorways? You're not broken and you're not alone. What the motorway fear loop is, why taking the long way round makes it stronger, and a small first practice step you can take this week.",
    photo: "/photos/hopeful-walk.jpg",
    photoAlt: "A person walking at golden hour, shoulders relaxing",
    intro: [
      "You used to just drive. Now the slip road makes your chest tighten, your hands go damp on the wheel, and somewhere around the merge a voice says: what if I panic at 70 and there's nowhere to stop? So you take the A-roads. Then the A-roads with the fewest dual carriageways. The journey takes forty minutes longer and you tell everyone you prefer the scenic route.",
      "If that's you, nothing is wrong with your driving. Something very normal has happened to your alarm system, and it can be practiced back down.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The motorway fear loop has three moving parts. First, a scary thought arrives: what if I lose control, what if I panic, what if I faint at speed. Second, your body reacts as if the danger were real right now: racing heart, tunnel vision, jelly legs. Third, you do something to feel safe: you slow to 50 in the left lane, grip the wheel, plan every exit, or skip the motorway entirely.",
        "Here's the trap. The safety move brings relief, and your brain files that relief as proof: 'we survived because we avoided.' It never gets to learn the truer thing, which is that the panic wave rises, peaks, and passes on its own, even at 70, even between junctions.",
      ],
    },
    avoidance: {
      title: "Why avoiding motorways makes the fear bigger",
      paras: [
        "Every time you take the long way round, the fear gets paid. Short-term relief is the most powerful teacher your brain has, and avoidance delivers it instantly. So the alarm gets wired in tighter, and the territory it claims grows: first motorways, then dual carriageways, then the outside lane anywhere, then driving alone at all.",
        "People often notice the shrinking world before they notice the fear itself. Jobs not applied for because of the commute. Friends visited less. A quiet deal with yourself that the passenger seat is fine, actually. Avoidance is never neutral. It compounds, like interest, in the wrong direction.",
      ],
    },
    practice: {
      title: "What graded practice looks like for motorway fear",
      paras: [
        "Graded exposure practice means facing the fear in planned, chosen steps, small enough to be doable and honest enough to matter, while dropping the safety behaviours that keep the alarm alive. You build a ladder from 'mildly uncomfortable' to 'the thing itself' and climb it one rung at a time.",
        "A motorway ladder might look like: sit in the car on the driveway and vividly imagine the merge. Drive one junction at a quiet time with someone beside you. The same junction alone. Two junctions. Two junctions in the middle lane, no exit-counting, radio off so you can't distract yourself. Each rung, you stay with the wave until it crests and falls, and you rate the fear before and after. Watching an 8 become a 5 with your own eyes is what rewires the alarm.",
        "The dropping-safety-behaviours part matters as much as the driving. One junction driven without rehearsing escape routes teaches more than fifty miles of white-knuckled coping.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "This week, don't drive anywhere new. Just write the ladder. Ten situations, easiest to hardest, from 'passenger on the motorway' to 'rush hour, middle lane, alone.' Say each one out loud and give it a fear score out of 10. Naming the ladder takes the loop out of your head and puts it on paper, where it's smaller. Rung one usually looks surprisingly doable from there.",
      ],
    },
    also: [
      {
        title: "Passenger avoidance",
        body: "Many people quietly stop being passengers too, because someone else controls the exits. If being driven on the motorway also spikes you, that's the same loop wearing a different coat, and it goes on the same ladder.",
      },
      {
        title: "Escape-route scanning",
        body: "Counting junctions, memorising service stations, checking the hard shoulder. It feels responsible, but it's the fear doing the route-planning, and it keeps the alarm switched on for the whole journey.",
      },
      {
        title: "Fear of the panic itself",
        body: "Often the real fear isn't crashing, it's panicking. What if it happens here, at speed, with no way out? If that rings true, the fear of panic attacks loop is worth reading next.",
      },
    ],
    faqs: [
      {
        q: "Is motorway anxiety a phobia or panic disorder?",
        a: "Only a clinician can tell you what label fits, and Steady doesn't diagnose anything. The good news is that the practice looks similar either way: graded steps toward the feared situation, with the safety behaviours dropped. You don't need the label to start practicing.",
      },
      {
        q: "What if I actually panic while driving?",
        a: "Panic is horrible and it is not dangerous to your ability to steer a car in the way the alarm claims. That said, practice should be graded for a reason: you start on rungs where the wave is manageable, at quiet times, on short stretches, and build evidence gradually. You never jump to the hardest rung, and if you have a medical condition that affects driving, talk to your doctor first.",
      },
      {
        q: "I've avoided motorways for years. Is it too late?",
        a: "No. Avoidance makes the alarm louder, not permanent. People who haven't merged in a decade still climb the ladder the same way: one rung, one wave, one 'that was easier than last time' at a time.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady is a voice companion you talk with out loud. It helps you map your specific motorway loop, build your ladder, and coaches you through practice sessions in real time, including the uncomfortable middle of the wave. It's a practice companion, not a therapist, and it will tell you that itself.",
      },
    ],
    related: ["fear-of-panic-attacks", "fear-of-being-trapped", "supermarket-panic-queues"],
  },
  {
    slug: "supermarket-panic-queues",
    kicker: "Panic in queues",
    h1: "I get panicky in supermarket queues and sometimes just abandon the trolley",
    short: "The checkout line closes in, the exit feels miles away, and suddenly the shopping doesn't matter.",
    metaTitle: "Supermarket Queue Panic: Why You Flee the Checkout and How to Practice Staying",
    metaDescription:
      "Panic in supermarket queues? Learn what the queue-panic loop is, why fleeing the checkout teaches your brain the wrong lesson, and one small graded practice step to start winning the aisle back.",
    photo: "/photos/window-lost.jpg",
    photoAlt: "A woman gazing out of a window, lost in thought",
    intro: [
      "It usually starts in the queue. You're boxed in, trolley in front, person behind, strip lights humming, and your body flips a switch: heat rising, heart thudding, that dreamlike 'I'm not quite here' feeling. The thought lands: I need to get out, now, before something happens. Sometimes you breathe through it. Sometimes you leave a full trolley by the tills and walk out into the car park, heart hammering, ashamed and relieved at once.",
      "Then the loop starts planning your life: shop at 7am when it's empty, use the self-checkout only, order online, send someone else. You're not lazy or dramatic. Your alarm system has learned the wrong lesson about queues, and lessons can be relearned.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The queue is a perfect storm for a false alarm: you can't leave without a scene, you're surrounded, you're under fluorescent light with a body that's already tense. A wave of panic symptoms arrives, and the mind explains them with a catastrophe: I'll faint, I'll be sick, I'll lose control in front of everyone.",
        "Escaping, or white-knuckling with your eyes fixed on the exit, brings the relief that stamps the lesson in: queues are dangerous, escape saved you. The truth your brain never gets to learn is that the wave has a shape. It rises, it peaks (usually within a minute or two), and it falls, whether you flee or not.",
      ],
    },
    avoidance: {
      title: "Why the workarounds grow the fear",
      paras: [
        "Online orders, empty-hour shopping, self-checkout only, always having your partner along: each workaround feels like clever logistics. Each one is also a vote for the alarm. The message received is 'we only survived because we avoided the queue,' so the alarm generalises: first the big shop, then the corner shop, then the post office, then anywhere with a line and strangers.",
        "The bill arrives as a shrinking map. And because the workarounds are so easy to justify, the shrinking is invisible until something you genuinely want, a gig, a flight, a school pickup, sits on the wrong side of a queue.",
      ],
    },
    practice: {
      title: "What graded practice looks like for queue panic",
      paras: [
        "You build a ladder of queues, easiest to hardest, and climb it on purpose. Maybe it starts with standing in a short queue at a quiet time and letting yourself be there, not scanning the exit, not gripping your phone as a lifeline. Then a longer queue. Then peak time. Then the deepest aisle of the shop with a full basket, which quietly commits you to the checkout.",
        "The rule that changes everything: you stay until the wave has peaked and started to fall, then you leave because you chose to, not because panic evicted you. You rate the fear before, at peak, and after. Over sessions, the peak drops and arrives later, and the queue turns back into what it always was: boring.",
        "Dropping the props is part of the practice. Phone in pocket, sunglasses off, no rehearsed excuse for the cashier. The queue has to be met as it is for the alarm to update.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Next time you're in any queue and the wave starts, try one thing: instead of planning your exit, name what's happening out loud in your head. 'This is the wave. It peaks and it passes.' Then rate it out of 10 and watch the number, like weather. You're not trying to feel calm. You're collecting your first piece of evidence that the wave has a shape.",
      ],
    },
    also: [
      {
        title: "Fear of the symptoms themselves",
        body: "For many people the real terror isn't the supermarket, it's the pounding heart and the unreal feeling. If the wave itself is what you fear, read the panic attack loop next, because that's usually the engine underneath.",
      },
      {
        title: "Safe-person dependence",
        body: "Only shopping when your partner or friend comes along. Lovely company, but if their presence is the thing making it possible, the alarm has made them a crutch, and practicing some rungs solo is where the freedom is.",
      },
      {
        title: "Escape-route scanning",
        body: "Standing at the end of the row, keeping the basket light so you can dump it, knowing exactly where the doors are. Exit-planning feels like safety and works like fear fertiliser.",
      },
    ],
    faqs: [
      {
        q: "Why does it happen in supermarkets specifically?",
        a: "Queues combine several triggers at once: feeling trapped, feeling watched, bright light, heat, and a body that's often already stressed. Once one bad wave happens there, your brain flags the whole setting. It's not about the shopping, it's about the exit feeling far away.",
      },
      {
        q: "Is it dangerous to stay in the queue while panicking?",
        a: "Panic feels catastrophic and passes on its own; that's its defining trick. If you have a heart condition or other medical concern, check with your doctor first so you can practice with confidence. Steady is not a medical service and can't assess that for you.",
      },
      {
        q: "I've been shopping online for two years. Where do I even start?",
        a: "Lower than you think, and that's fine. Rung one might be walking into the shop and buying one item at self-checkout. Ladders start where you are, not where you think you should be.",
      },
      {
        q: "How does Steady help with this?",
        a: "You talk with Steady out loud, map your queue loop in plain words, and build your ladder together. Before a practice trip you can rehearse the rung, and afterwards debrief what the wave actually did versus what the alarm predicted. Steady is a practice companion, not a therapist or crisis service.",
      },
    ],
    related: ["fear-of-panic-attacks", "fear-of-being-trapped", "driving-anxiety-motorways"],
  },
  {
    slug: "fear-of-being-trapped",
    kicker: "Feeling trapped",
    h1: "I can't cope with places I can't easily leave",
    short: "Middle seats, lifts, traffic jams, the hairdresser's chair. If the exit is blocked, the alarm goes off.",
    metaTitle: "Fear of Being Trapped: The Exit-Checking Loop and How to Practice Staying",
    metaDescription:
      "Lifts, middle seats, traffic, locked doors. If feeling trapped sets off your alarm, learn what the loop is, why exit-planning feeds it, and a small graded step toward sitting easy anywhere.",
    photo: "/photos/woman-headphones-couch.jpg",
    photoAlt: "A woman on a couch with headphones, taking a breath",
    intro: [
      "The cinema is fine if you're on the aisle. The train is fine if it isn't the fast one that skips stations. The lift is fine if the stairs are broken and you truly have no choice, and even then you hold your breath. The theme is always the same: it's not the place, it's the exit. When leaving would be slow, awkward, or impossible, your body treats the room like a trap snapping shut.",
      "So you've become an exit specialist. Aisle seats booked weeks ahead, stairs over lifts, the seat nearest the door in every meeting. It works, mostly. It's also exhausting, and the list of places that feel okay keeps getting shorter.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The trapped loop runs on one question: could I get out if I needed to? The moment the answer is 'not easily,' your threat system starts drumming: what if you panic in here, what if you're ill, what if you make a scene. The body joins in with heat, a racing heart, and a powerful urge to move.",
        "Then comes the deal-making: sit here not there, leave the meeting 'for water,' skip the fast train. Every deal buys relief now and pays for it later, because your brain concludes the exit really was the thing keeping you safe. The actual evidence, that you can feel trapped, ride the wave, and be fine, never gets collected.",
      ],
    },
    avoidance: {
      title: "Why exit-planning grows the fear",
      paras: [
        "Notice that the fear isn't satisfied by one exit. First the aisle seat is enough. Then it needs to be the back row too. Then you need to know where the toilets are, and to have your phone, and for the event to be under an hour. Safety demands always escalate, because the alarm treats every met demand as proof the danger was real.",
        "Meanwhile the world quietly reorganises around the fear: the gigs not booked, the flights white-knuckled or skipped, the promotion avoided because the new office is on the 14th floor. The trap you were afraid of ends up built out of your own workarounds.",
      ],
    },
    practice: {
      title: "What graded practice looks like for the trapped feeling",
      paras: [
        "You practice being un-exitable, on purpose, in graded doses. A ladder might run: sit in the middle of the row in an empty cinema. Ride the lift two floors. Ride it six. Take the stopping train one stop past your station and come back. Sit in the middle seat at a family dinner and stay through dessert. Book the window seat.",
        "On every rung the job is the same: let the trapped feeling arrive, drop the negotiating, and stay while the wave rises, peaks, and passes. No counting floors, no gripping your phone, no rehearsed excuse. You rate the fear before and after so the update is visible: the room was never the trap, the alarm was.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Today, pick one tiny exit-ritual you always do, checking where the doors are, or taking the seat nearest them, and skip it once in an easy setting. A coffee shop, not a plane. Notice the itch to fix it, and let the itch be there without obeying it. That itch, allowed to fade on its own, is the whole practice in miniature.",
      ],
    },
    also: [
      {
        title: "Escape-route scanning",
        body: "Clocking every door the moment you enter a room, mapping toilets in venues, sitting where you can see the exit. It feels like prudence. It's the loop doing surveillance, and it keeps the alarm primed all day.",
      },
      {
        title: "Queue and crowd panic",
        body: "Checkouts, security lines, packed platforms: queues are the trapped feeling with witnesses. If the supermarket queue is one of your hotspots, that page is worth reading next.",
      },
      {
        title: "Fear of the panic itself",
        body: "Underneath 'what if I can't get out' usually lives 'what if I panic and can't get out.' The trapped fear and the fear of panic attacks are close cousins and share a ladder.",
      },
    ],
    faqs: [
      {
        q: "Is this claustrophobia or agoraphobia?",
        a: "Those words describe overlapping territories, and only a clinician can tell you which fits you; Steady doesn't diagnose. What matters for practice is your personal map: which situations spike you, how much, and what you do to escape them. That map is buildable in an afternoon.",
      },
      {
        q: "What if I really do need to leave sometimes?",
        a: "You can always leave; practice is chosen, not imposed. The skill you're building is leaving because you decided to, after the wave has peaked, rather than being ejected by panic. That difference is everything.",
      },
      {
        q: "Why do lifts, planes, and haircuts all set me off? They're so different.",
        a: "They share one ingredient: leaving is costly or impossible for a stretch of time. The alarm doesn't care about the decor, it cares about the exit. That's also why one ladder, practiced well, tends to help across all of them.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady talks it through with you out loud: mapping your exit rules, ranking the rungs, and coaching you through the middle of practice sessions. It's a warm practice companion built around graded exposure practice, not a therapist, and never a substitute for one when you need real care.",
      },
    ],
    related: ["supermarket-panic-queues", "driving-anxiety-motorways", "fear-of-panic-attacks"],
  },
  {
    slug: "health-anxiety-symptom-checking",
    kicker: "Health anxiety",
    h1: "I keep checking symptoms and Googling the worst-case at 2am",
    short: "The headache that must be scanned, the mole photographed weekly, the search history you'd never show anyone.",
    metaTitle: "Health Anxiety and Symptom Checking: Why Googling Feeds the Fear",
    metaDescription:
      "Checking symptoms, Googling diseases, poking the same spot to see if it still hurts? Learn how the health anxiety loop works, why checking grows it, and one small step to start unhooking.",
    photo: "/photos/googling-night.jpg",
    photoAlt: "A person lit by a phone screen late at night",
    intro: [
      "It starts with a sensation. A flutter in your chest, a headache that's lasted a bit long, a patch of skin that looks different in this light. Then the question arrives, reasonable-sounding, urgent: what if this is the serious one? So you check. You Google. You prod the spot to see if it still hurts (it does now, because you've prodded it forty times). You compare today's mole photo with last Tuesday's. Relief comes, sometimes, for a while. Then the question returns with interest.",
      "You are not a hypochondriac cliché. You're a person whose alarm system has latched onto the one topic where 'just make sure' never ends, because the body always has one more sensation to offer.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The health anxiety loop is a doubt engine. Sensation, scary story, check, brief relief, louder doubt. The checking is the pedal that keeps it spinning: every scan, search, and prod tells your brain 'this question is life-or-death, keep raising it.' And the body cooperates cruelly, because anxiety itself produces symptoms, racing heart, chest tightness, dizziness, tingling, which then become the next thing to check.",
        "Googling deserves its own mention. Search engines are optimised to show you the dramatic, not the likely. You ask about a headache and meet a tumour in three clicks. The loop reads that as confirmation, never as what it is: a slot machine that always has one more scary card.",
      ],
    },
    avoidance: {
      title: "Why checking and reassurance grow it",
      paras: [
        "Checking feels like diligence, but watch what it trains: the more you scan, the more sensations you find, and the more the alarm learns that sensations require investigation. Reassurance works the same way, whether it comes from Google, your partner ('feel this, is it normal?'), or the GP visit that calms you for exactly four days. Each hit of certainty makes the next doubt hungrier.",
        "The cost creeps. Evenings lost to searching. Appointments booked and re-booked. A quiet radar running all day, scanning your own body like hostile territory. The loop doesn't want you healthy, it wants you checking.",
      ],
    },
    practice: {
      title: "What practice looks like for health anxiety",
      paras: [
        "The practice here is mostly about not doing: graded reduction of the checking and reassurance rituals, while letting the uncertainty they were suppressing rise and pass. You build a ladder of 'unanswered questions,' easiest to hardest. Maybe rung one is noticing a headache and waiting an hour before any response. Higher rungs: a full day with no symptom Googling, deleting the mole photo archive, feeling the flutter and letting it be simply unexplained.",
        "Alongside, many people practice facing the fear directly: saying out loud 'this sensation might be nothing, and I'm choosing not to find out today,' and sitting with the wave that follows. The wave peaks, falls, and each time it does, the alarm's grip on your body loosens slightly. The goal isn't certainty about your health. It's a life where uncertainty doesn't run the schedule.",
        "One boundary matters: sensible healthcare stays. New, persistent, or serious symptoms deserve a real doctor, once, properly. Practice targets the checking that you yourself know is the loop, the ninth search, the fortieth prod, and if you're unsure which is which, that's a conversation for your GP.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Tonight, put one rule between you and the search bar: a 24-hour delay. When the urge comes, write the exact question on a note instead, with the time. If it still feels urgent tomorrow at that time, you can decide then. Most notes die quietly overnight, and every note that dies is evidence the urgency was the loop talking, not your body.",
      ],
    },
    also: [
      {
        title: "Reassurance-seeking from people",
        body: "Asking your partner to look at it, calling your mum who was a nurse, posting in forums. Human reassurance is warmer than Google and feeds the same loop. If asking-then-asking-again sounds familiar, read the reassurance loop next.",
      },
      {
        title: "Body scanning",
        body: "A background habit of sweeping the body for data: heart okay? breathing okay? that twinge again? Scanning finds noise, the noise raises the question, and the loop thanks you for your service.",
      },
      {
        title: "Rumination about the meaning of it all",
        body: "Long mental essays at 3am about what you'd do if it were serious, how you'd tell people, what you might have missed. That's rumination wearing a stethoscope, and it responds to the same practice.",
      },
    ],
    faqs: [
      {
        q: "But what if I miss something real?",
        a: "This is the loop's best line, and it deserves a straight answer: practice never asks you to skip real healthcare. See your doctor for new or persistent symptoms, follow screening advice, take what they say seriously once. What practice targets is the re-checking after that, the part that never adds information, only fear. Steady can't diagnose you and won't try; that's what real medicine is for.",
      },
      {
        q: "Why does reassurance from my GP only last a few days?",
        a: "Because the problem was never a missing fact, it's an intolerance of uncertainty. Certainty from any source is a painkiller for doubt, not a repair. The repair is practicing letting the doubt exist without medicating it, which is exactly what the ladder trains.",
      },
      {
        q: "Is it normal that anxiety causes real physical symptoms?",
        a: "Extremely. A threat-activated body produces racing heart, chest tightness, dizziness, gut trouble, tingling, and more. Which is the loop's cruellest trick: the fear of symptoms manufactures symptoms. Knowing that won't stop the wave by itself, but it changes what the wave means.",
      },
      {
        q: "How does Steady help with this?",
        a: "You talk with Steady out loud about your specific checks and rules, map the loop, and build a graded plan to shrink it. In sessions, Steady coaches you through leaving a question unanswered, and it will lovingly decline to reassure you about symptoms, because that quick relief is the loop's fuel. It's a practice companion, not a doctor or therapist.",
      },
    ],
    related: ["reassurance-seeking-loops", "intrusive-thoughts-loops", "rumination-cant-stop-thinking"],
  },
  {
    slug: "social-anxiety-replaying-conversations",
    kicker: "Social replay",
    h1: "I replay conversations for days and cringe at things nobody else remembers",
    short: "The 1am post-match analysis of a chat that lasted ninety seconds.",
    metaTitle: "Replaying Conversations: The Social Post-Mortem Loop and How to Stop Feeding It",
    metaDescription:
      "Still cringing about something you said on Tuesday? Learn why the conversation-replay loop exists, why avoiding people grows it, and one small practice step toward saying it and letting it go.",
    photo: "/photos/dawn-thoughts.jpg",
    photoAlt: "A person deep in thought in early morning light",
    intro: [
      "The meeting ended hours ago, but your head is still in the room. Why did I say that? Did she pause because I was weird? I talked too much. I laughed at the wrong moment. You run the tape again, frame by frame, hunting for the exact second you embarrassed yourself, and every replay finds new evidence. By midnight you've drafted three apologies you'll never send for an offence nobody noticed.",
      "This is the social replay loop, and it has one revealing feature: the post-mortem never actually closes the case. It just books tomorrow's hearing.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "Social anxiety runs on a prediction: if I'm not careful, people will see something wrong with me and reject me. Before an event it fuels rehearsal. During, it splits your attention, half on the chat, half on monitoring yourself from the outside. After, it runs the replay: reviewing the footage for crimes, which always works, because footage reviewed by a prosecutor always produces charges.",
        "The replay feels like learning. It isn't. Memory under anxiety is a hostile editor: it deletes the normal minutes, zooms in on the wobble, and adds a soundtrack. You aren't reviewing what happened. You're reviewing the fear's cut of what happened.",
      ],
    },
    avoidance: {
      title: "Why avoidance and safety habits grow it",
      paras: [
        "The obvious avoidance is declining invitations. But this loop mostly grows through subtler moves: rehearsing every sentence before you say it, keeping opinions vague, staying quiet in meetings, being the person who asks questions so they never have to be the topic. Every safety habit gets you through the event and tells the alarm the event was dangerous.",
        "And the replay itself is avoidance in disguise. As long as you're analysing Tuesday, you're not feeling the raw thing underneath: the possibility that someone might think less of you and you'd have to live with not knowing. The loop would rather run the tape forever than sit with that for ten minutes. Which is exactly why sitting with it is the way out.",
      ],
    },
    practice: {
      title: "What practice looks like for the replay loop",
      paras: [
        "Two ladders, climbed together. The first is social: doing graded, chosen things where imperfection is possible. Ask an obvious question in a meeting. Give an opinion you haven't polished. Tell a story without checking anyone's face mid-sentence. Small rungs first, harder ones as the evidence builds that wobbles cost less than predicted.",
        "The second ladder is about the replay itself: catching the post-mortem starting and declining to attend. Not by force ('stop thinking about it' famously fails) but by letting the cringe-wave be there, unanalysed, while you do something real. The urge to review is just an urge. Like every wave, it peaks and passes when it stops getting fed.",
        "The measure of progress isn't 'no awkward moments.' It's awkward moments that cost you an hour instead of a week.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Tonight, if the replay starts, give it one honest sentence instead of an hour: 'Something might have been awkward, and I'm choosing not to investigate.' Say it out loud if you can. Then notice the itch to re-open the case, and let the itch fade on its own timetable. That single unattended post-mortem is rung one.",
      ],
    },
    also: [
      {
        title: "Pre-event rehearsal",
        body: "Scripting the anecdote, pre-loading questions to ask, planning your seat. The bookend of the replay: the loop working the case before it happens. Same fear, same practice: go in slightly under-rehearsed, on purpose.",
      },
      {
        title: "Message-checking and editing",
        body: "Reading your sent texts again to see how they landed, drafting a two-line email nine times, the '. . . did that emoji look sarcastic?' spiral. It's the replay loop in writing.",
      },
      {
        title: "General rumination",
        body: "If your brain also runs post-mortems about decisions, work, or life itself, you've got a general rumination habit and the replay is one channel of it. The rumination page digs into that engine.",
      },
    ],
    faqs: [
      {
        q: "Doesn't reviewing conversations help me improve socially?",
        a: "A one-minute honest reflection ('I interrupted Sam, I'll watch that') is useful and finishes. The loop's version is a repeating trial with no verdict, no new information after the first pass, and a worse mood every lap. If it loops, it isn't learning.",
      },
      {
        q: "What if people really did think I was weird?",
        a: "Maybe someone did; that's the uncertainty the loop can't stand. But run the numbers on your own side: how many of other people's awkward moments do you remember from last week? The spotlight you feel on yourself is one you're holding.",
      },
      {
        q: "Why does the cringe hit hardest at night?",
        a: "No competition. During the day, life crowds the replay out; at night the tape gets the whole cinema. It's also why practicing the 'unattended post-mortem' at bedtime, once you're ready for that rung, is such a strong move.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady is a voice you talk to out loud, which matters here, because the replay lives in your inner voice. You map the loop, build both ladders, and practice letting a cringe-wave pass without analysis, with a warm coach in your ear. Steady is a practice companion, not a therapist, and works well alongside one.",
      },
    ],
    related: ["rumination-cant-stop-thinking", "sunday-night-dread", "reassurance-seeking-loops"],
  },
  {
    slug: "contamination-washing-loops",
    kicker: "Contamination fears",
    h1: "I wash until my hands crack and I still don't feel clean",
    short: "The tap you elbow, the 'one more rinse', the door handle that ends the whole feeling-clean project.",
    metaTitle: "Contamination and Washing Loops: Why 'One More Wash' Never Finishes the Job",
    metaDescription:
      "Washing until it hurts and still not feeling clean? Learn how the contamination loop works, why washing grows the doubt, and one small graded step toward touching the world again.",
    photo: "/photos/calm-breath.jpg",
    photoAlt: "A person taking a slow, steadying breath",
    intro: [
      "You know the routine better than anyone should. The soap, the count, the backs of the hands, between the fingers, and then, just as you reach for the towel, the thought: did the towel touch the bin earlier? And the feeling of clean, the thing all of this was for, dissolves. So you start again. Your hands sting. Winter is worse. You use your sleeve on door handles and your knuckle on the lift button, and the kitchen has zones only you can see.",
      "Here's the thing you may already suspect: this was never really about germs. It's about a feeling of contamination that soap can't reach, and a doubt that washing feeds.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The contamination loop runs: trigger (the handle, the bin, the hospital visit, sometimes just a thought), a wave of disgust and dread, then the ritual, washing, wiping, changing clothes, quarantining objects, and finally relief. Briefly. Because the ritual answered the feeling, not the facts, and feelings re-ask their questions.",
        "Notice the tell: no amount of washing ever settles it for long, and the standards keep rising. Twenty seconds becomes two minutes, soap becomes scalding water, one wash becomes a sequence with rules. That escalation is the signature of a loop being fed, not a hygiene standard being met.",
      ],
    },
    avoidance: {
      title: "Why washing and avoiding grow it",
      paras: [
        "Every wash teaches your brain two things: the danger was real, and the feeling of contamination is intolerable and must be obeyed. So the alarm gets more sensitive and the territory grows: more objects feel dirty, more rooms have rules, more of your day routes around invisible hazards. Avoidance does the same job more quietly: the not-touched handle, the never-used public loo, the shoes that can't come past the mat.",
        "The cost is time, skin, and a world sorted into clean and contaminated with you as full-time customs officer. Many people also rope in family, asking others to wash, to keep zones, to reassure. Love makes them comply, and compliance feeds the loop.",
      ],
    },
    practice: {
      title: "What graded practice looks like for contamination fears",
      paras: [
        "The practice is exposure with response prevention: touching the feared thing, in graded steps, and then not doing the ritual, letting the contaminated feeling rise, peak, and fade on its own. It's the 'not washing after' that does the teaching. The feeling, unanswered, burns out, and each time it does, it comes back weaker.",
        "A ladder might run: touch the 'clean-ish' door handle at home and wait ten minutes before washing. Touch it and don't wash, then eat a snack. Touch the bin lid with one finger. Hold a coin. Use the public loo and wash once, normally, twenty seconds, no repeat. The rungs are yours to choose, and each one is practiced until it's boring before you climb.",
        "Normal hygiene stays: one reasonable wash before eating, after the loo. The target is the loop's extras, the repeats, the rules, the rituals your own gut knows are about the feeling, not the germs.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Pick the mildest thing on your contaminated list, the one that's maybe a 3 out of 10. Touch it with one hand, then set a ten-minute timer before you're allowed to wash. Spend the ten minutes noticing the feeling without arguing with it. When the timer rings, you choose. Delay is the gentlest first rung there is, and it already teaches the core lesson: the feeling fades without being obeyed.",
      ],
    },
    also: [
      {
        title: "Checking rituals",
        body: "Contamination and checking are frequent housemates: did I wash properly, did the raw chicken touch anything, is the surface really clean? If verifying-then-reverifying runs in other areas too, the checking loop page will feel familiar.",
      },
      {
        title: "Mental contamination",
        body: "Feeling dirty after a memory, a person, or a thought, with no physical contact at all, and washing to get rid of the feeling. It's common, it's real, and it responds to the same practice: the feeling, not the germ, is the target.",
      },
      {
        title: "Roping in the household",
        body: "Asking family to wash on entry, keep zones, or confirm something is clean. Their reassurance is warm and, like all reassurance, it's loop fuel. Practicing often includes gently retiring their jobs too.",
      },
    ],
    faqs: [
      {
        q: "But germs are real. How is washing a problem?",
        a: "Germs are real and ordinary hygiene handles them: soap, twenty seconds, the standard moments. The loop starts where the evidence stops, the fourth wash, the sleeve on every handle, the rules that keep growing. The test isn't 'are germs real,' it's 'does any amount ever feel like enough?' If the answer is no, it's the loop.",
      },
      {
        q: "Won't I get ill if I practice touching things?",
        a: "Practice asks you to take the same ordinary risks everyone around you takes all day: handles, coins, benches, followed by normal hygiene. If you're immunocompromised or have medical guidance about infection, follow your doctor's advice and build your ladder within it. Steady can't give medical advice and won't pretend to.",
      },
      {
        q: "Why do I feel contaminated by things that never touched me?",
        a: "Because the loop trades in the feeling of contamination, which spreads by association, not contact. The chair the coat touched, the bag that was in the hospital. That's not you being irrational, it's how this specific loop works, and it fades with the same unanswered-wave practice.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady helps you map your zones, rules, and washes out loud, build a graded ladder, and coaches you through the hardest part, the not-washing-after, in real time, including the wave's uncomfortable middle. It's a practice companion built on exposure practice, not a therapist or medical service.",
      },
    ],
    related: ["checking-locks-oven-loops", "intrusive-thoughts-loops", "reassurance-seeking-loops"],
  },
  {
    slug: "checking-locks-oven-loops",
    kicker: "Checking loops",
    h1: "I check the locks and the oven again and again, and I'm still not sure",
    short: "The third trip back to the front door. The photo of the hob you'll check from the train.",
    metaTitle: "Checking Locks and Ovens: Why the Fifth Check Feels Less Sure Than the First",
    metaDescription:
      "Checking the door, the oven, the straighteners, then checking again? Learn why repeated checking erodes certainty instead of building it, and one small step toward leaving the house once.",
    photo: "/photos/checking-door.jpg",
    photoAlt: "A hand resting on a front door handle",
    intro: [
      "You locked the door. You felt it lock. You pushed it, twice. And halfway down the path the question arrives anyway: but did I? So you go back. You watch yourself lock it this time, really concentrating. On the train the oven joins in, then the straighteners, then the tap in the bathroom. Some days you photograph the hob before leaving, and some days the photo doesn't help either, because what if it's from yesterday?",
      "Here's the strangest, most important fact about this loop: the more you check, the less certain you feel. That's not you failing at checking. That's how checking works.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The checking loop runs on a catastrophic 'what if': the house burns down, the flat floods, the burglary happens, and it's my fault, because I could have prevented it. The doubt creates real dread, the check relieves it, and the relief convinces your brain the check was necessary. So the doubt returns sooner, sharper, and hungrier.",
        "Worse, repeated checking actually corrodes memory confidence. When you check the same lock five times, the five memories blur together, and the act becomes automatic instead of vivid. You genuinely remember it less clearly, which the loop reads as reason to check a sixth time. It's a machine that manufactures the very doubt it promises to fix.",
      ],
    },
    avoidance: {
      title: "Why the rituals grow it",
      paras: [
        "Every ritual, the triple push, the photo, the counting, the 'I'm watching myself do this' ceremony, raises the bar for what feeling sure requires. First one check was enough. Now it's three, plus the push, plus the photo. Certainty keeps moving because certainty was never the product; relief was, and relief has a shrinking half-life.",
        "The costs stack up quietly: the twenty minutes added to leaving the house, the lateness you keep explaining, the trips back that make you look flaky, the low hum of dread whenever you're the last one out. Some people start avoiding being the last one out at all, which hands the loop the keys.",
      ],
    },
    practice: {
      title: "What graded practice looks like for checking",
      paras: [
        "The practice is one good check, then done, and then riding the doubt-wave without going back. A ladder makes it graded: start with something low-stakes, check the bathroom tap once and leave the room for ten minutes without returning. Then the straighteners: once, out of the house, around the block. Then the front door: one check, no push-push-push, walk away at normal speed. Then the full leave-for-work with a single lap of checks and no photos.",
        "The wave of doubt will come; that's the point. You let it shout 'go back' and you keep walking, and somewhere down the road it stops, because unanswered alarms always do. Each time, your brain logs the real lesson: the discomfort was survivable and the house was fine. Rate the doubt before and after so you can watch it shrink across a week of practice.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Tomorrow morning, pick your least scary check and make it 'once, with attention': do it slowly, say out loud 'the oven is off,' and leave the room. When the urge to re-check arrives, give it a nickname ('there's the echo') and let it pass without a hearing. One survived echo is the entire method in miniature.",
      ],
    },
    also: [
      {
        title: "Mental checking",
        body: "Reviewing the memory of locking the door instead of walking back, running the tape to feel sure. Same loop, no shoes required. It responds to the same practice: one review at most, then let the doubt hum.",
      },
      {
        title: "Asking others to confirm",
        body: "Texting 'did you see me lock up?', asking your partner to do the last-out ritual. Outsourced checks are still checks, and the reassurance page covers that cousin loop in full.",
      },
      {
        title: "Contamination-flavoured checks",
        body: "Did the raw chicken touch the counter, is the surface really clean, did I wash properly? Where checking meets contamination, both pages apply, and the ladder can hold rungs from each.",
      },
    ],
    faqs: [
      {
        q: "Isn't checking the door just being responsible?",
        a: "Once, yes. Responsibility checks once and moves on. The loop's version has different fingerprints: repetition, rituals, relief that doesn't last, and doubt that grows with every pass. If checking made you certain, you'd have been certain years ago.",
      },
      {
        q: "What if I really did leave the oven on one day?",
        a: "Then you'd deal with it, like the millions of people who occasionally leave an oven on and whose houses are overwhelmingly fine. The loop sells a world where one missed check equals catastrophe and it's all on you. Practicing 'one check, then live' is also practicing a truer sense of how risk and responsibility actually work.",
      },
      {
        q: "Do the photos of the hob count as checking?",
        a: "Yes, and they're a classic escalation: a portable re-check you can perform forever. Notice that the photos stopped settling it too. On the ladder, retiring the camera is its own rung, usually an easier one than people expect.",
      },
      {
        q: "How does Steady help with this?",
        a: "You tell Steady, out loud, exactly what your leaving-the-house sequence looks like, build a ladder to shrink it, and practice the walk-away with a warm voice coaching you through the echo. Steady is a practice companion using exposure-based practice, not a therapist, and it will remind you of that itself.",
      },
    ],
    related: ["contamination-washing-loops", "reassurance-seeking-loops", "intrusive-thoughts-loops"],
  },
  {
    slug: "fear-of-panic-attacks",
    kicker: "Fear of panic",
    h1: "I'm more scared of the next panic attack than of anything else",
    short: "Living braced. Scanning your heartbeat like a smoke detector. Building a life around 'what if it happens here'.",
    metaTitle: "Fear of Panic Attacks: The Fear-of-Fear Loop and How Practice Unwinds It",
    metaDescription:
      "Scared of the next panic attack? That fear-of-fear is its own loop. Learn why bracing and avoiding keep panic close, what interoceptive practice looks like, and one small first step.",
    photo: "/photos/sunrise-exhale.jpg",
    photoAlt: "A person exhaling slowly at sunrise",
    intro: [
      "The first one probably came out of nowhere: a slamming heart, no air, the floor tilting, the absolute certainty that this was a heart attack or madness or death. It passed. And it left something behind, a new fear, worse than most fears, because its subject lives in your chest: what if that happens again?",
      "So now you live braced. You know where every exit is. You monitor your heartbeat like a nervous parent. Coffee is gone, lifts are suspect, and busy places get rated by how bad it would be to panic there. The attacks themselves might be rare now. The fear of them is daily.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "Panic is the body's alarm going off without a fire: adrenaline, racing heart, fast shallow breathing, dizziness, unreality. Unpleasant, time-limited, and not dangerous in the way it insists. The loop begins when the mind starts fearing the alarm itself. Now a flight of stairs that raises your pulse reads as 'it's starting,' which triggers adrenaline, which raises your pulse, which confirms 'it's starting.' The fear of the wave builds the wave.",
        "That's why this loop is called fear-of-fear, and it explains its cruellest feature: scanning for panic makes panic more likely. A watched body always produces something to worry about.",
      ],
    },
    avoidance: {
      title: "Why bracing and avoiding keep panic close",
      paras: [
        "Every avoided lift, skipped coffee, clutched water bottle, and aisle seat says the same thing to your brain: panic is a catastrophe that must never happen. So the alarm stays on a hair trigger. And because relief follows every avoidance, the list grows: places, drinks, exercise, being alone, being far from a hospital, until the fear of a five-minute body-storm is running the calendar.",
        "The safety props deserve special mention: the water bottle, the phone, the 'just in case' pill in the pocket that never gets taken. Props whisper that you survived because of them. Practice without them is how you learn you survive because waves end.",
      ],
    },
    practice: {
      title: "What practice looks like for fear of panic",
      paras: [
        "There are two ladders here. The first is places: returning, rung by rung, to everywhere panic has claimed, the queue, the lift, the motorway, the cinema seat in the middle of the row, and staying while the wave rises, peaks, and falls, without props or exits.",
        "The second is bolder and stranger: practicing the sensations themselves, on purpose. Climb stairs fast until your heart pounds, and let it pound. Spin gently on a chair until dizzy. Breathe fast for thirty seconds, then let your body settle itself. Done in graded, chosen doses, this teaches the deepest lesson available: the sensations are just sensations. When a racing heart stops meaning 'emergency,' panic loses its ignition.",
        "Go gently and stack the deck: start small, repeat each rung until it's boring, and if you have a heart condition or other medical concern, clear the sensation practice with your doctor first.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Today, on purpose, take the stairs fast enough to feel your heart, and then, and this is the practice, do nothing about it. No sitting down, no pulse-checking, no slow-breathing ritual. Stand there and let your body come down on its own schedule, like it does for people who sprint for buses. You just taught your brain the first line of the new story: a loud heart is allowed.",
      ],
    },
    also: [
      {
        title: "Trapped-place avoidance",
        body: "Panic fear and the trapped feeling feed each other: what makes a place scary is how hard it would be to escape mid-wave. If lifts, queues, and middle seats top your list, the trapped page is your next read.",
      },
      {
        title: "Body scanning",
        body: "The background heartbeat-audit, the 'was that a skip?' pause, the pulse check hidden as a wrist rest. Monitoring feels protective and works as an ignition system.",
      },
      {
        title: "Health anxiety",
        body: "Many people bounce between 'it's panic' and 'but what if it's my heart,' with Googling in between. If the symptom-checking spiral is familiar, the health anxiety page covers that whole engine.",
      },
    ],
    faqs: [
      {
        q: "Can a panic attack actually hurt me?",
        a: "Panic is the body's own alarm system firing hard, and passing. It reliably feels like an emergency; that's its design. If you've never had your symptoms checked out, do that once with a doctor so you can practice with a settled mind. Steady is not a medical service and can't do that part for you.",
      },
      {
        q: "Why would I bring on the sensations deliberately? That sounds like madness.",
        a: "Because the fear lives in the sensations, and you can't unlearn a fear you never let yourself feel. Chosen, graded doses of a pounding heart, with nothing bad happening after, is the fastest route your brain has to 'oh, this is safe.' It's the same logic as every exposure ladder, pointed inward.",
      },
      {
        q: "I haven't had an attack in months, but I still plan my life around them. Is that a problem?",
        a: "It's the most common version of this loop: the attacks retreat, the bracing stays. The avoidance and the props are now what keeps the fear alive. Which is also hopeful, because they're yours to practice dropping, rung by rung.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady talks with you out loud, maps where panic has claimed territory, helps you build both ladders, and coaches you through waves in real time, the rising, the peak, the proof that it passes. It's a warm practice companion, not a therapist or crisis service, and in a crisis it will point you to real human help.",
      },
    ],
    related: ["supermarket-panic-queues", "driving-anxiety-motorways", "fear-of-being-trapped"],
  },
  {
    slug: "sunday-night-dread",
    kicker: "Sunday dread",
    h1: "Sunday night arrives and the dread rolls in like weather",
    short: "The 5pm cloud. The inbox you open 'just to check'. The week rehearsed nine times before it starts.",
    metaTitle: "Sunday Night Dread: The Week-Rehearsal Loop and How to Get Your Evenings Back",
    metaDescription:
      "Stomach sinking every Sunday evening? Learn what the Sunday dread loop is, why mentally rehearsing the week feeds it, and one small practice step to reclaim the last hours of your weekend.",
    photo: "/photos/tired-morning.jpg",
    photoAlt: "A person sitting quietly with a mug in low morning light",
    intro: [
      "Sunday has a watershed. Before it, the weekend. After it, somewhere around late afternoon, the cloud: a heaviness in the chest, a mind that starts listing, Monday's meeting, the unanswered email, the thing you said you'd finish, the general sense that the week is a wave about to break on you. You half-watch television while mentally attending Monday. Some people open the laptop 'just to get ahead,' and the weekend ends three hours early, every week.",
      "Sunday dread is so common it's furniture, but common doesn't mean harmless: it's a loop, it grows, and the hours it eats are yours.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "The engine is anticipatory worry: the mind rehearsing the week to feel prepared. Each rehearsal surfaces a threat (the meeting, the deadline, the difficult person), which produces a jolt of dread, which the mind tries to soothe with more rehearsal. Rounds of this can fill an entire evening, and none of it is planning. Planning produces decisions and stops. Worry produces dread and continues.",
        "The 'just checking' email adds its own twist: a peek at the inbox relieves the uncertainty for a moment, teaches the brain that Sunday evenings are for work-vigilance, and hands the loop your living room.",
      ],
    },
    avoidance: {
      title: "Why rehearsal and checking grow it",
      paras: [
        "Rehearsing the week feels responsible, but watch the exchange rate: hours of dread on Sunday buy you nothing on Monday. The meeting goes how it goes. What the rehearsal actually purchases is a stronger habit, a brain more convinced that unrehearsed weeks are dangerous, and a dread that starts arriving earlier, mid-afternoon, then after lunch, then, for some people, on Saturday night.",
        "The checking works the same way. Every 'quick look' at the inbox teaches the alarm that peeking is what keeps you safe, so the urge comes back stronger next week. And avoidance has a subtler form here: numbing through the dread with the phone, the scroll, one more episode, so Sunday evening is neither restful nor useful, just gone.",
      ],
    },
    practice: {
      title: "What practice looks like for Sunday dread",
      paras: [
        "The practice is a planned collision with an unrehearsed week. First, contain the legitimate planning: fifteen minutes, earlier in the day, on paper. What genuinely needs deciding for Monday? Decide it, write it down, close the notebook. That's planning honoured and finished.",
        "Then comes the exposure part: an evening with no inbox, no rehearsal, and the dread allowed to be there. When the mind offers Monday's meeting for review, you let the thought sit unanswered, the same way you'd leave any loop's question hanging, and return to your actual evening. The wave of 'but I should just check' rises, peaks, and passes. Weeks of this teach the real lesson: unrehearsed Mondays go fine, and Sunday evenings belong to you.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "This Sunday, do the fifteen-minute planning session at 4pm, write 'planning is closed' at the bottom of the page, and then put something you actually enjoy in the 8pm slot, something with hands, food, people, or outdoors in it. When the rehearsal urge arrives at 8:15, greet it by name ('that's the dread, not a to-do') and let it pass without a meeting. One reclaimed Sunday evening is proof of concept.",
      ],
    },
    also: [
      {
        title: "Weekday-morning dread",
        body: "The same loop runs a morning edition: waking at 5am with the day pre-playing. The practice is identical, planning has an office and office hours, and the wave that says 'rehearse now' gets to pass unanswered.",
      },
      {
        title: "General rumination",
        body: "If your brain also chews on the past, decisions, and 'what's wrong with me' essays, Sunday dread is one channel of a wider rumination habit. The rumination page covers the engine itself.",
      },
      {
        title: "Replaying the last week",
        body: "Some Sundays face backwards: reviewing what you got wrong last week, the email that sounded off, the thing you should have said. That's the social replay loop moonlighting, and it shares a practice.",
      },
    ],
    faqs: [
      {
        q: "Isn't some Sunday planning sensible?",
        a: "Completely, which is why the practice keeps a fifteen-minute, on-paper planning slot. The tell is what happens after: planning decides and stops. Dread rehearses and continues. If you're on lap four of the same meeting, no new decisions are being produced, and the loop has the pen.",
      },
      {
        q: "What if my job genuinely is the problem?",
        a: "Sometimes the dread carries real information: a role, workload, or workplace that needs changing. Practice doesn't argue with that; it clears the fog so you can see it. A Sunday evening spent looping tells you nothing. A calm look at what specifically you dread, mapped in plain words, often does.",
      },
      {
        q: "Why does checking my email 'just once' make it worse?",
        a: "Because relief is a teacher. The peek relieves uncertainty, your brain logs 'peeking = safety,' and next Sunday the urge arrives earlier and louder. You've also just told your week it may start whenever it likes. A closed inbox until Monday is a boundary, and like most boundaries it gets easier every time it holds.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady is a voice companion you talk with out loud. On a Sunday it can help you map what the dread is actually made of, close the planning, and practice letting rehearsal-urges pass while your evening happens. It's a practice companion, not a therapist, and not a substitute for changing a genuinely wrong situation.",
      },
    ],
    related: ["rumination-cant-stop-thinking", "social-anxiety-replaying-conversations", "fear-of-panic-attacks"],
  },
  {
    slug: "intrusive-thoughts-loops",
    kicker: "Intrusive thoughts",
    h1: "Horrible thoughts barge into my head and I can't make them stop",
    short: "The thought you'd never say out loud, the 3am 'what kind of person thinks that?', the checking of your own mind.",
    metaTitle: "Intrusive Thoughts: Why Fighting Them Feeds Them, and What to Practice Instead",
    metaDescription:
      "Unwanted, horrible thoughts on a loop? You're not dangerous and not alone. Learn why fighting intrusive thoughts strengthens them, and how letting them pass unanswered takes their power away.",
    photo: "/photos/night-loop.jpg",
    photoAlt: "A dim bedroom at night, thoughts refusing to settle",
    intro: [
      "It's a thought you would never choose: harming someone you love, something blasphemous mid-prayer, something violent or sexual or simply wrong, arriving uninvited in the middle of an ordinary moment. And then the worse part: the question about the thought. Why did I think that? What does it mean about me? Would a good person's brain produce that?",
      "So you fight it, argue with it, scan your mind to see if it's gone, avoid the knife drawer or the balcony or being alone with the baby, and quietly conduct a one-person trial that never reaches a verdict. Here is the ground truth this page stands on: intrusive thoughts are universal. Nearly everyone has them. The loop isn't the thought. The loop is the fight.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "Brains produce junk thoughts constantly, random, associative, often deliberately awful, the mental equivalent of spam. Most people's spam gets ignored and forgotten. The loop begins when a thought gets flagged as significant: this one matters, this one might be me. Attention turns to it, alarm attaches to it, and the brain, which prioritises whatever you fear, starts serving it more often.",
        "Then come the rituals, some visible, most mental: arguing the thought down, replaying it to check how you felt, praying it away, seeking reassurance, avoiding triggers. Each ritual treats the thought as dangerous, which is exactly the lesson that keeps it coming. The content is a red herring. The machinery is the same whether the thought is violent, sexual, religious, or just deeply wrong-feeling.",
      ],
    },
    avoidance: {
      title: "Why fighting and avoiding grow it",
      paras: [
        "Thought suppression fails in a famous way: try hard not to think of a white bear, and the bear moves in. Every push-back is attention, and attention is the currency the loop runs on. Checking is worse: 'is the thought gone? did it disgust me enough?' is a search of your own mind, and searches always find something.",
        "Avoidance seems safer and costs more: skipping the school run, hiding the knives, avoiding the news, never being alone with the person the thought involves. Each avoidance confirms the thought was a genuine warning, and each one shrinks your life. The cruellest part: the distress itself is evidence in your favour. The thought horrifies you precisely because it collides with your values. You've been reading the alarm as a confession when it's the opposite.",
      ],
    },
    practice: {
      title: "What practice looks like for intrusive thoughts",
      paras: [
        "The practice is a changed relationship, not a cleaner mind: thoughts get to arrive, and you get to leave them unanswered. No arguing, no checking, no ritual, no avoidance. In graded steps, you stop treating the thought as an emergency, let the anxiety it drags in rise and pass, and return to what you were doing, with the thought still there if it likes.",
        "Graded means graded. Early rungs might be writing the thought down in plain words, or saying it out loud once, and letting the wave that follows peak and fade. Later rungs walk back into avoided territory: the knife drawer used for cooking, the balcony stood on, the solo school run done. Over weeks the brain relearns the filing: this is spam, not signal, and the thoughts genuinely quieten, not because you defeated them, but because you stopped paying them.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Next time the thought arrives, try the smallest possible act of non-engagement: name it and file it. 'That's an intrusive thought. Noted.' No argument, no checking whether it's gone, no verdict on what it means. Then return your hands and eyes to whatever you were doing and let the discomfort hum until it doesn't. That's rung one, and it's the whole method in one move.",
      ],
    },
    also: [
      {
        title: "Mental checking and reviewing",
        body: "Re-running the thought to test your reaction, scanning for whether you felt the 'right' amount of horror, reviewing old memories for evidence about yourself. It's checking, aimed inward, and it feeds the loop exactly like re-locking a door.",
      },
      {
        title: "Reassurance-seeking",
        body: "Confessing thoughts to a partner to hear 'you'd never do that,' Googling 'can you become someone who...', posting anonymously to be told you're normal. Relief arrives, the question returns hungrier. The reassurance page covers this cousin in full.",
      },
      {
        title: "Rumination about meaning",
        body: "Hours-long inner essays on what the thoughts say about your soul, your sanity, your future. Analysis feels different from fear and does the same job: it keeps the thought on the front page.",
      },
    ],
    faqs: [
      {
        q: "Do these thoughts mean something about who I am?",
        a: "The distress is the answer: the thought horrifies you because it's the opposite of what you want. That said, Steady doesn't diagnose, and a clinician who knows this territory can be genuinely settling to talk to once, properly. What loops isn't the meaning of the thought; it's the checking of the meaning.",
      },
      {
        q: "Are intrusive thoughts really that common?",
        a: "Yes. When researchers ask ordinary people whether they experience unwanted intrusive thoughts, including violent and taboo ones, the overwhelming majority say yes. The difference isn't who gets the thoughts. It's who gets stuck fighting them.",
      },
      {
        q: "Should I tell someone about the content of my thoughts?",
        a: "Telling one trusted person, or a professional, once, in order to stop hiding, can be a relief and a good rung. Telling repeatedly to feel okay again is reassurance-seeking, and it feeds the loop. The test, as ever: does it close the question, or does the question come back hungrier?",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady gives you a private, judgment-free voice to say the unsayable to, out loud, which robs the thought of its secrecy, and then helps you practice leaving it unanswered, with a warm coach in your ear while the wave passes. Steady is a practice companion, not a therapist, and if you're worried about acting on thoughts, that's a conversation for a real clinician.",
      },
    ],
    related: ["rumination-cant-stop-thinking", "reassurance-seeking-loops", "contamination-washing-loops"],
  },
  {
    slug: "rumination-cant-stop-thinking",
    kicker: "Rumination",
    h1: "My brain won't drop it. I think about the same things for hours.",
    short: "The shower debates, the ceiling-staring, the same problem chewed nightly with no verdict ever reached.",
    metaTitle: "Rumination: Why You Can't Think Your Way Out of the Loop",
    metaDescription:
      "Stuck thinking about the same thing for hours? Learn what rumination actually is, why it masquerades as problem-solving, and one small practice step to put the case file down.",
    photo: "/photos/kitchen-mapping.jpg",
    photoAlt: "A person at a kitchen table, deep in thought",
    intro: [
      "It has the costume of thinking. You're 'working through' the decision, the argument, the career, the thing you said in 2019, the question of what's wrong with you. In the shower, on the commute, at 3am, the same case gets reopened, the same evidence reviewed, the same laps run. And after two hours of it you have: no decision, a worse mood, and a strange conviction that a few more laps might crack it.",
      "That's the tell. Real thinking finishes. Rumination laps.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "Rumination is mental problem-solving aimed at problems that can't be solved by more thinking: the past ('why did I do that?'), other minds ('what did she really mean?'), the unfalsifiable ('what if I'm broken?'). Because the questions have no reachable answer, the analysis never completes, and the incompleteness itself feels like a reason to continue.",
        "The loop pays you to stay, in tiny coins: a fleeting sense of progress, a feeling of taking the problem seriously, a hit of 'nearly got it.' Meanwhile it quietly charges the real bill, hours, sleep, mood, presence, and hands you tomorrow's session at checkout. It's a slot machine that pays in tokens for its own use.",
      ],
    },
    avoidance: {
      title: "Why rumination is avoidance in disguise",
      paras: [
        "This is the counterintuitive core: rumination continues because it avoids something. Staying in the head, analysing, means not feeling the raw thing underneath, the grief, the uncertainty, the 'I may never know.' Analysis is dry land; the feeling is the water. As long as the debate continues, the verdict, with its sting, never has to be felt.",
        "It also avoids action. The person ruminating about the career never quite updates the CV; the one reviewing the friendship never quite has the conversation. Thinking about it feels adjacent to doing something about it, and that adjacency is the trap. The loop grows because every session is one more rehearsal of the habit, and the habit generalises: brains that ruminate about one thing learn to ruminate about everything.",
      ],
    },
    practice: {
      title: "What practice looks like for rumination",
      paras: [
        "You can't stop a thought by force, but you can decline the session. The practice has three moves. First, catch the on-ramp: rumination has triggers and opening lines ('why am I like this...'), and noticing 'the case is reopening' is half the skill. Second, answer the only useful question: is there an action here? If yes, name the smallest one and do or diary it. If no, the session has nothing to offer.",
        "Third, the exposure part: put the file down and let the unfinishedness itch. That itch, the 'but we haven't resolved it!', is a wave like any other. It rises, it demands, it passes, and every time it passes unattended, the habit weakens. You return attention to something real, hands, senses, the person in front of you, not to feel better, but to give the loop nothing to chew.",
        "Some people also give the loop office hours: fifteen minutes, same time daily, where worries get written down and given their hearing. Outside office hours, items get deferred, not debated. It sounds silly and works strangely well.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Today, when you catch a familiar lap beginning, say the sentence that names it: 'This is rumination, and there's no verdict coming.' Then ask 'is there one action?' and act or file. Then let the itch hum while you do the dishes badly. That whole sequence takes ninety seconds, and it is the entire practice at rung one.",
      ],
    },
    also: [
      {
        title: "Conversation replay",
        body: "If the case files are mostly social, what you said, how it landed, what they think of you now, you're in the replay loop's territory, and that page has the targeted version of this practice.",
      },
      {
        title: "Sleep-adjacent looping",
        body: "The 3am board meeting: mind clear, house quiet, case wide open. Night laps feel profound and produce nothing the morning agrees with. Office hours plus the put-the-file-down practice work here too.",
      },
      {
        title: "Reassurance and Googling",
        body: "Rumination often outsources: Googling the question, polling friends, re-reading old messages for evidence. The moment the loop starts doing research, the reassurance page applies.",
      },
    ],
    faqs: [
      {
        q: "How is rumination different from actually solving my problem?",
        a: "Solving produces decisions and ends: you can point to the output. Rumination produces laps: same question, same evidence, no verdict, worse mood. A quick test: after twenty minutes, ask 'what did I decide?' If the answer is nothing, again, the pen is in the loop's hand.",
      },
      {
        q: "Doesn't ignoring the problem mean I don't care?",
        a: "Putting the file down isn't ignoring; you keep the one-action rule, so anything doable gets done. What you're declining is the ceremonial re-reading of a file with no new pages. Caring is measured in actions and presence, and rumination consumes both.",
      },
      {
        q: "Why is it always worse at night and in the shower?",
        a: "Unoccupied attention. The loop needs bandwidth, and it gets the most when the world asks nothing of you. That's also why the practice leans on returning attention to hands and senses: it's not distraction for its own sake, it's taking the bandwidth back.",
      },
      {
        q: "How does Steady help with this?",
        a: "Rumination runs in your inner voice, so talking out loud moves the case into the open air, where it's smaller. Steady helps you map your loops in plain words, spot the on-ramps, run the one-action test, and practice letting the itch pass, warmly, and without ever pretending to be a therapist, because it isn't one.",
      },
    ],
    related: ["intrusive-thoughts-loops", "social-anxiety-replaying-conversations", "sunday-night-dread"],
  },
  {
    slug: "reassurance-seeking-loops",
    kicker: "Reassurance loops",
    h1: "I keep asking 'are we okay?' and the relief never lasts",
    short: "The re-sent text, the 'you'd tell me if you were annoyed, right?', the answer that soothes for an hour.",
    metaTitle: "Reassurance-Seeking: Why 'Just Tell Me It's Fine' Never Stays Fine",
    metaDescription:
      "Asking for reassurance again and again, and the relief keeps wearing off? Learn how the reassurance loop works, why every answer feeds the next question, and one small step toward tolerating not-knowing.",
    photo: "/photos/asking-reassurance.jpg",
    photoAlt: "Two people in conversation on a sofa",
    intro: [
      "You know the script by heart. 'Are you annoyed with me?' 'Are we okay?' 'You'd tell me if something was wrong?' And the loving person opposite says what they always say, and warmth floods in, and for an hour or a day the question sleeps. Then it wakes hungrier. Maybe they said it in a funny tone. Maybe they were just being nice. Maybe you should ask again, properly this time.",
      "The questions might be about the relationship, your health, your work, whether you locked up, whether that thing you said was okay. The subject rotates; the machinery is identical. And the person you ask is usually kind, which is exactly why the loop works.",
    ],
    loop: {
      title: "What this loop actually is",
      paras: [
        "Reassurance-seeking is a certainty ritual. A doubt arrives with a spike of anxiety, you extract a 'it's fine' from someone (or from Google, or from re-reading the message thread), and the anxiety drops. That drop is the payment. Your brain, which repeats whatever relieves, files the lesson: doubts are emergencies, and asking is the fix.",
        "But certainty from outside has a half-life, because the doubt was never about missing information. It's about not tolerating the sliver of not-knowing that comes with every human thing: other minds, health, the future. No answer covers tomorrow. So the question returns, and each cycle sharpens it: you start monitoring tone, re-reading texts, asking in disguised ways so it doesn't count as asking.",
      ],
    },
    avoidance: {
      title: "Why every answer grows the question",
      paras: [
        "Each reassurance is a small avoidance: the wave of uncertainty was rising, and the answer let you step out of it. The wave never gets to peak and pass on its own, so your tolerance for uncertainty, the actual muscle, weakens. More situations start requiring a check-in before they feel safe.",
        "There's a relationship bill too. The asked person becomes part of the ritual: recruited for nightly confirmations, careful about their tone, tired in a way neither of you names. Some start reassuring pre-emptively, which feeds the loop from the other side. None of this is anyone's fault. It's the loop, running its standard play on two kind people.",
      ],
    },
    practice: {
      title: "What practice looks like for reassurance loops",
      paras: [
        "The practice is graded not-asking: letting the doubt arrive, skipping the ritual, and riding the uncertainty wave until it passes, which it does, every time, on its own. You build a ladder of questions by difficulty. Rung one might be a low-stakes doubt ('was that email okay?') left unasked for a day. Higher rungs: the big recurring question left unasked for a week, tone-monitoring retired, the message thread not re-read.",
        "It helps enormously to brief the people involved. A partner who knows the plan can respond to the old question with warmth minus the answer: 'I love you, and I'm not feeding the loop.' That's not coldness; it's the two of you against the loop, instead of the loop between you. Expect the itch to spike before it fades; unanswered questions get louder before they get quiet, and that fade, felt from the inside, is the whole lesson.",
      ],
    },
    firstStep: {
      title: "One small first step",
      paras: [
        "Pick your most-asked question and delay it once: when the urge hits, write it down with the time and give it 24 hours. You're not banned from asking; you're letting the wave peak before deciding. Most written questions look different the next day, and every question that dies on the page is evidence your gut can now use: the urgency was the loop, not the truth.",
      ],
    },
    also: [
      {
        title: "Health-flavoured reassurance",
        body: "'Feel this, is it normal?' The medical version of the same ritual, with Google as a tireless second opinion. If the subject of your questions is your body, the health anxiety page covers that whole engine.",
      },
      {
        title: "Confession and checking-in",
        body: "Telling your partner every thought so nothing's hidden, confessing small 'crimes' to feel clean, ending each night with a status check on the relationship. Confession works like asking: brief relief, hungrier doubt.",
      },
      {
        title: "Digital re-reading",
        body: "Scrolling back through the thread to check how your message landed, re-reading old replies for tone, screenshotting for a friend to analyse. It's reassurance-seeking with the receipts, and it belongs on the ladder.",
      },
    ],
    faqs: [
      {
        q: "Isn't asking for reassurance just healthy communication?",
        a: "Once, yes: real communication asks, hears, and moves on. The loop's version has the fingerprints: the same question repeating, relief that wears off, asking that gets sneakier, and a partner who's become a nightly ritual. The test is never the question. It's whether any answer ever lasts.",
      },
      {
        q: "Won't my relationship get worse if I stop checking in?",
        a: "Usually the reverse, and gently briefing your partner is part of the practice. Most partners are relieved to swap the reassurance treadmill for one honest agreement, warmth always, answers to the loop never. You get closeness back that the ritual had been spending.",
      },
      {
        q: "What if the doubt is right and something really is wrong?",
        a: "Real problems announce themselves through evidence and pattern, not through a doubt that needs feeding nine times a day. Practicing not-asking doesn't silence truth; it clears the static so genuine signals are easier to hear, and real conversations, the once kind, easier to have.",
      },
      {
        q: "How does Steady help with this?",
        a: "Steady will be endlessly warm with you and will lovingly decline to answer the loop's question, because that quick relief is what keeps it alive. Instead, you practice out loud: mapping your questions, building the not-asking ladder, and riding the wave with a kind voice alongside. Steady is a practice companion, not a therapist or crisis service.",
      },
    ],
    related: ["health-anxiety-symptom-checking", "checking-locks-oven-loops", "rumination-cant-stop-thinking"],
  },
];

export function getTopic(slug: string): HelpTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
