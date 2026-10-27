# Lifecycle messages (emails + browser push)

Status 2026-10-27. Rules live in `lib/lifecycle/rules.ts`. The welcome email at sign-up and the email channel in the cron are planned and not wired yet; push is built.

## Sequence

```mermaid
sequenceDiagram
    autonumber
    actor L as Learner
    participant B as Browser
    participant App as Next.js app
    participant DB as Supabase
    participant Cron as Vercel Cron (daily 07:00 UTC)
    participant Mail as Resend
    participant Push as Browser push service

    rect rgb(240, 244, 250)
    Note over L,DB: Sign-up
    L->>B: Clicks "Mit Google registrieren"
    opt Ticks the unticked consent checkbox
        B->>B: Sets lc_consent cookie (15 min)
    end
    B->>App: /auth/callback (Google code)
    App->>DB: Create session
    alt lc_consent cookie present
        App->>DB: lifecycle_prefs: consent + CONSENT_VERSION
    end
    App->>Mail: Welcome email, to everyone (service email, no offers)
    App->>DB: lifecycle_messages: willkommen (email)
    App-->>B: Redirect to /dashboard
    end

    rect rgb(240, 250, 244)
    Note over L,Push: Browser permission (dashboard, no pass, at most once per 7 days)
    B->>L: "Benachrichtigungen anzeigen?"
    alt Allowed
        B->>Push: Subscribe (VAPID public key)
        Push-->>B: Endpoint + keys
        B->>App: savePushSubscription()
        App->>DB: push_subscriptions (upsert on endpoint)
    else Blocked or ignored
        Note over B: No push, the in-app next-step card still shows
    end
    end

    rect rgb(250, 246, 238)
    Note over Cron,Push: Every day
    Cron->>App: GET /api/cron/lifecycle (CRON_SECRET)
    App->>DB: reachableUsers() + learnerState()
    App->>App: nextEmail(state, now)
    alt A moment is due (max 5 per person, each once, 48 h apart)
        App->>DB: Claim the moment in lifecycle_messages
        par Email consent given
            App->>Mail: Email with unsubscribe link
        and Push subscription exists
            App->>Push: Encrypted push (VAPID signed)
            alt 404 or 410
                App->>DB: Delete subscription
            end
        end
        opt Nothing delivered
            App->>DB: Delete the claim
        end
    else Nothing due
        Note over App: Skip this learner
    end
    end

    Push->>B: Notification
    L->>B: Clicks it
    B->>App: Opens the next step (e.g. /dashboard/dtz/hoeren/1)
```

## Learner states

```mermaid
stateDiagram-v2
    [*] --> SignedUp: Google sign-up
    SignedUp --> Welcomed: Welcome email (everyone)

    state "Series (only with email consent or push)" as Series {
        [*] --> Waiting
        Waiting --> DeinStand: 3 days after welcome
        Waiting --> ZahlungOffen: 2-72 h after an abandoned payment
        DeinStand --> Waiting: 48 h gap
        ZahlungOffen --> Waiting: 48 h gap
        Waiting --> Endspurt: 14-4 days before the exam
        Endspurt --> Waiting: 48 h gap
    }

    Welcomed --> Series
    Series --> Paid: Buys Pruefungspass
    Series --> WieWars: 3-14 days after the exam
    Paid --> WieWars: 3-14 days after the exam
    Series --> Unsubscribed: Unsubscribe link or Konto switch
    WieWars --> [*]
    Unsubscribed --> [*]

    note right of Series
        At most 5 messages per person, each kind once.
        One moment goes out on every channel the learner turned on.
    end note
```
