import { 
  Database,
  RefreshCw,
  AlertTriangle,
  CalendarX,
  UserMinus,
  ArrowRightLeft
} from 'lucide-react';

export interface MakeScenario {
  id: string;
  name: string;
  trigger: string;
  action: string;
  whyItMatters: string;
  icon: any;
}

export const makeScenarios: MakeScenario[] = [
  {
    id: 'scenario-1',
    name: 'Scenario 1 — New Member Sync',
    trigger: 'New client created in MB',
    action: "Create/update GHL contact. Tag 'active-member'. Move pipeline to 'Active Member'. Stop all nurture.",
    whyItMatters: 'Prevents paying members getting lead nurture texts.',
    icon: Database
  },
  {
    id: 'scenario-2',
    name: 'Scenario 2 — Attendance Sync',
    trigger: 'Class visit logged in MB',
    action: "Increment GHL custom field 'total_visits'. At 10 or 50 visits: add tag 'milestone-10' or 'milestone-50'.",
    whyItMatters: 'Enables GHL milestone celebration workflows.',
    icon: RefreshCw
  },
  {
    id: 'scenario-3',
    name: 'Scenario 3 — Payment Failure',
    trigger: 'Failed payment in MB',
    action: 'POST to GHL inbound webhook. GHL workflow sends urgent SMS + creates staff task.',
    whyItMatters: 'MB payment events are invisible to GHL without this.',
    icon: AlertTriangle
  },
  {
    id: 'scenario-4',
    name: 'Scenario 4 — No-Show/Late Cancel',
    trigger: 'No-show or cancellation in MB',
    action: 'POST to GHL inbound webhook. GHL workflow handles follow-up messaging.',
    whyItMatters: 'MB records no-shows operationally; Make passes to GHL.',
    icon: CalendarX
  },
  {
    id: 'scenario-5',
    name: 'Scenario 5 — Lapsed Check (Daily)',
    trigger: 'Scheduled daily',
    action: "MB flags lapsed members via Apiant webhook. Make syncs to GHL: update custom field days_since_visit, add tag lapsed-14 or lapsed-30. GHL workflow then handles messaging.",
    whyItMatters: 'Triggers GHL lapsed workflows. Tag check in GHL prevents duplicates.',
    icon: UserMinus
  },
  {
    id: 'scenario-6',
    name: 'Scenario 6 — Membership Change',
    trigger: 'Membership cancelled/expired in MB',
    action: "Update GHL contact stage and tags. If PT package cancelled but class membership active: tag pt-cancelled, update client_type to Class Only. If class membership cancelled but PT active: tag class-cancelled, update client_type to PT Only.",
    whyItMatters: 'Keeps GHL pipeline accurate.',
    icon: ArrowRightLeft
  }
];
