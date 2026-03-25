import { 
  Zap, 
  MessageSquare, 
  Clock, 
  GitBranch, 
  Tag, 
  UserCircle,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';

export type StepType = 'trigger' | 'action' | 'wait' | 'condition' | 'tag' | 'task' | 'end';

export interface Branch {
  label: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  type: StepType;
  title: string;
  description: string;
  hoverDetail?: string;
  branches?: Branch[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: any;
  technicalDetails: string;
  steps: WorkflowStep[];
}

export const ghlTags = [
  { name: 'welcome-sent', description: 'Prevents duplicate welcome messages on New Lead entry.' },
  { name: 'no-response-72h', description: 'Applied after 72h of no response to welcome series. Triggers staff task.' },
  { name: 'consult-booked', description: 'Applied when a trial/consult is booked to stop standard lead nurture.' },
  { name: 'no-show-contacted', description: 'Prevents duplicate follow-ups for a missed appointment.' },
  { name: 'payment-failed-notified', description: 'Prevents duplicate alerts for a single failed payment event.' },
  { name: 'lapsed-14-sent', description: 'Applied when the 14-day re-engagement SMS is sent.' },
  { name: 'lapsed-30-sent', description: 'Applied when the 30-day stronger offer SMS is sent.' },
  { name: 'birthday-sent-[year]', description: 'Dynamic tag (e.g., birthday-sent-2026) to prevent multiple sends per year.' },
  { name: 'review-requested', description: 'Applied after asking for a Google review to prevent spamming.' },
  { name: 'missed-call-textback-sent', description: 'Prevents multiple auto-replies if the same person calls twice quickly.' },
  { name: 'pt-drop-task-sent', description: 'Prevents duplicate staff tasks when a PT package is cancelled.' },
  { name: 'active-member', description: 'CRITICAL: The kill switch. Halts all lead nurture workflows immediately.' },
  { name: 'milestone-10', description: 'Applied by n8n on the 10th visit to trigger celebration.' },
  { name: 'milestone-50', description: 'Applied by n8n on the 50th visit to trigger celebration.' },
  { name: 'pt-cancelled', description: 'Applied by n8n when a PT package is cancelled in MindBody.' },
  { name: 'class-cancelled', description: 'Applied by n8n when a class membership is cancelled in MindBody.' },
  { name: 'b2b-opportunity', description: 'Manually applied by staff to trigger a native GHL invoice task.' },
  { name: 'social-no-response', description: 'Applied after 72h of no reply to a social DM. Triggers staff task.' }
];

export const workflows: Workflow[] = [
  {
    id: 'new-lead-welcome',
    name: '1. New Lead Welcome',
    description: 'Instantly engages new leads with a welcome message and follow-up email.',
    icon: UserCircle,
    technicalDetails: 'Trigger: Contact Created in GHL. Priority: Critical. Logic: Sends SMS instantly, waits 1 hour, sends email. Applies "welcome-sent" tag. Merge fields used: {{contact.first_name}}.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Contact Created', description: 'A new lead enters GHL.', hoverDetail: 'Sources: Meta Lead Ad, Wix form, social DM, walk-in, comment-to-DM.' },
      { id: 's2', type: 'action', title: 'Send Welcome SMS', description: 'Instantly sends a welcome text message.', hoverDetail: 'Must include "Reply STOP to opt out" per A2P 10DLC rules.' },
      { id: 's3', type: 'wait', title: 'Wait 1 Hour', description: 'Pauses the workflow for 60 minutes.', hoverDetail: 'Allows time for the lead to read the SMS before sending an email.' },
      { id: 's4', type: 'action', title: 'Send Welcome Email', description: 'Sends a follow-up welcome email.', hoverDetail: 'Sent from info@ybxfitness.com via Gmail SMTP.' },
      { id: 's5', type: 'tag', title: 'Add Tag', description: 'Tags the contact as "welcome-sent".', hoverDetail: 'Duplicate prevention: If this tag exists, the workflow will not fire again.' },
      { id: 's6', type: 'end', title: 'End Workflow', description: 'Lead is now in the nurture pipeline.', hoverDetail: 'Moves to Lead No-Response workflow if no reply.' }
    ]
  },
  {
    id: 'lead-no-response',
    name: '2. Lead No-Response',
    description: 'Follows up with leads who haven\'t replied to the initial welcome.',
    icon: Clock,
    technicalDetails: 'Trigger: Continues from Welcome. Priority: Critical. Logic: Waits 24h, checks for reply. If no, sends SMS. Waits 72h, checks for reply. If no, tags "no-response-72h" and creates staff task.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Continues from Welcome', description: 'Automatically flows from Welcome workflow.', hoverDetail: 'Only triggers if the lead has not replied or booked.' },
      { id: 's2', type: 'wait', title: 'Wait 24 Hours', description: 'Gives the lead a day to respond.', hoverDetail: 'Respects business hours (e.g., only sends between 8 AM - 8 PM).' },
      { id: 's3', type: 'condition', title: 'Check for Reply', description: 'Checks if the lead has replied.', hoverDetail: 'Condition: Has Replied = True/False', branches: [
        { label: 'Yes (Replied)', steps: [
          { id: 's3-y1', type: 'end', title: 'AI Takes Over', description: 'Conversation AI handles the reply.', hoverDetail: 'Pipeline moves to "Contact Made".' }
        ]},
        { label: 'No (No Reply)', steps: [
          { id: 's4', type: 'action', title: 'Send Follow-up SMS', description: 'Sends a gentle nudge text message.', hoverDetail: 'Example: "Hey {{contact.first_name}}, just bubbling this up!"' },
          { id: 's5', type: 'wait', title: 'Wait 72 Hours', description: 'Waits another 3 days for a response.', hoverDetail: 'Final automated attempt before human intervention.' },
          { id: 's6', type: 'condition', title: 'Still No Reply?', description: 'Check again for a reply.', hoverDetail: 'Condition: Has Replied = True/False', branches: [
            { label: 'Yes (Replied)', steps: [
              { id: 's6-y1', type: 'end', title: 'AI Takes Over', description: 'Conversation AI handles the reply.', hoverDetail: 'Pipeline moves to "Contact Made".' }
            ]},
            { label: 'No (No Reply)', steps: [
              { id: 's7', type: 'tag', title: 'Add Tag', description: 'Tags as "no-response-72h".', hoverDetail: 'Used for reporting and filtering.' },
              { id: 's8', type: 'task', title: 'Create Staff Task', description: 'Alerts staff to manually call the lead.', hoverDetail: 'Task includes full contact context and merge fields.' },
              { id: 's9', type: 'end', title: 'End Workflow', description: 'Staff takes over manually.', hoverDetail: 'Lead remains in pipeline until marked Abandoned/Lost.' }
            ]}
          ]}
        ]}
      ]}
    ]
  },
  {
    id: 'trial-booking',
    name: '3. Trial Booking Confirmation',
    description: 'Confirms trial bookings and sends reminders to ensure attendance.',
    icon: CalendarCheck,
    technicalDetails: 'Trigger: Appointment Status = Booked. Priority: Critical. Logic: Send SMS, wait until 24h before, send reminder SMS, tag "consult-booked", move pipeline to "Tour Scheduled".',
    steps: [
      { id: 's1', type: 'trigger', title: 'Appointment Booked', description: 'Lead books a trial or consult.', hoverDetail: 'Triggered via MindBody calendar sync or GHL widget.' },
      { id: 's2', type: 'action', title: 'Send Confirmation SMS', description: 'Instantly confirms the date and time.', hoverDetail: 'Includes exact appointment time and location.' },
      { id: 's3', type: 'action', title: 'Update Pipeline', description: 'Moves the lead to "Tour Scheduled".', hoverDetail: 'Automates pipeline movement without staff input.' },
      { id: 's4', type: 'wait', title: 'Wait Until 24h Before', description: 'Pauses until exactly 24 hours before.', hoverDetail: 'Time-based wait step relative to appointment time.' },
      { id: 's5', type: 'action', title: 'Send Reminder SMS', description: 'Sends a reminder text.', hoverDetail: 'Example: "See you tomorrow at {{appointment.time}}!"' },
      { id: 's6', type: 'tag', title: 'Add Tag', description: 'Tags as "consult-booked".', hoverDetail: 'Stops standard lead nurture sequences.' },
      { id: 's7', type: 'end', title: 'End Workflow', description: 'Ready for the appointment.', hoverDetail: 'Awaits appointment completion or no-show.' }
    ]
  },
  {
    id: 'appointment-no-show',
    name: '4. Appointment No-Show',
    description: 'Attempts to re-engage leads who missed their scheduled appointment.',
    icon: AlertCircle,
    technicalDetails: 'Trigger: Appointment Status = No Show. Priority: Critical. Logic: Wait 2h, send re-book SMS, create staff call task, tag "no-show-contacted".',
    steps: [
      { id: 's1', type: 'trigger', title: 'Status: No Show', description: 'Appointment is marked as a no-show.', hoverDetail: 'Triggered via MindBody webhook (Zap 4).' },
      { id: 's2', type: 'wait', title: 'Wait 2 Hours', description: 'Waits a couple of hours.', hoverDetail: 'Avoids seeming overly aggressive immediately after the missed time.' },
      { id: 's3', type: 'action', title: 'Send Re-book SMS', description: 'Sends a text inviting them to reschedule.', hoverDetail: 'Includes a direct link to the booking calendar.' },
      { id: 's4', type: 'task', title: 'Create Staff Task', description: 'Assigns a task for staff to call.', hoverDetail: 'Priority: High. "Call {{contact.first_name}} - missed appointment."' },
      { id: 's5', type: 'tag', title: 'Add Tag', description: 'Tags as "no-show-contacted".', hoverDetail: 'Prevents duplicate tasks if status is toggled accidentally.' },
      { id: 's6', type: 'end', title: 'End Workflow', description: 'Staff handles the follow-up.', hoverDetail: 'Pipeline remains in "Tour Scheduled" until re-booked or lost.' }
    ]
  },
  {
    id: 'payment-failure',
    name: '5. Payment Failure Alert',
    description: 'Urgently notifies members and staff when a payment fails.',
    icon: Zap,
    technicalDetails: 'Trigger: Inbound Webhook from Zap 3. Priority: High. Logic: Send urgent SMS + email to member, create red-priority staff task, tag "payment-failed-notified".',
    steps: [
      { id: 's1', type: 'trigger', title: 'Payment Failed', description: 'System detects a failed payment.', hoverDetail: 'Triggered via Apiant/MindBody webhook to n8n to GHL.' },
      { id: 's2', type: 'action', title: 'Send Urgent SMS & Email', description: 'Notifies the member of the failure.', hoverDetail: 'Includes a link to update billing info in MindBody.' },
      { id: 's3', type: 'task', title: 'Create Red-Priority Task', description: 'Alerts staff immediately.', hoverDetail: 'Priority: Urgent. Staff must follow up to prevent churn.' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "payment-failed-notified".', hoverDetail: 'Prevents spamming the member if the webhook fires twice.' },
      { id: 's5', type: 'end', title: 'End Workflow', description: 'Awaiting payment resolution.', hoverDetail: 'Member must update payment in MindBody.' }
    ]
  },
  {
    id: 'member-lapsed-14',
    name: '6. Member Lapsed (14 Days)',
    description: 'Re-engages members who haven\'t visited the gym in 14 days.',
    icon: Clock,
    technicalDetails: 'Trigger: Inbound Webhook from Zap 5 (Daily Check). Priority: Critical. Logic: Check tag "lapsed-14-sent". If absent, send SMS, add tag. Wait 7 days, if no visit, escalate to staff.',
    steps: [
      { id: 's1', type: 'trigger', title: '14 Days Since Last Visit', description: 'System detects 14 days of inactivity.', hoverDetail: 'Triggered by daily n8n check against MindBody attendance.' },
      { id: 's2', type: 'condition', title: 'Check Tags', description: 'Is "lapsed-14-sent" tag absent?', hoverDetail: 'Ensures we only send this once per lapse period.', branches: [
        { label: 'No (Tag Present)', steps: [
          { id: 's2-n1', type: 'end', title: 'Already Contacted', description: 'Prevents spamming the member.', hoverDetail: 'Workflow terminates early.' }
        ]},
        { label: 'Yes (Tag Absent)', steps: [
          { id: 's3', type: 'action', title: 'Send Re-engagement SMS', description: 'Sends a friendly "we miss you" text.', hoverDetail: 'Example: "Hey {{contact.first_name}}, haven\'t seen you in a couple weeks!"' },
          { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "lapsed-14-sent".', hoverDetail: 'Locks out future 14-day alerts until tag is cleared.' },
          { id: 's5', type: 'wait', title: 'Wait 7 Days', description: 'Waits a week to see if they return.', hoverDetail: 'Gives them time to book a class.' },
          { id: 's6', type: 'condition', title: 'Did they visit?', description: 'Checks attendance records.', hoverDetail: 'Checks if custom field `days_since_visit` < 21.', branches: [
            { label: 'Yes', steps: [
              { id: 's6-y1', type: 'end', title: 'Member Returned', description: 'Goal achieved.', hoverDetail: 'Tag is cleared on next visit.' }
            ]},
            { label: 'No', steps: [
              { id: 's7', type: 'task', title: 'Escalate to Staff', description: 'Creates a task for staff to check in.', hoverDetail: 'Priority: High. Personal outreach required.' },
              { id: 's8', type: 'end', title: 'End Workflow', description: 'Staff handles manually.', hoverDetail: 'Will trigger 30-day lapsed workflow in 9 more days.' }
            ]}
          ]}
        ]}
      ]}
    ]
  },
  {
    id: 'birthday-promotion',
    name: '7. Birthday Promotion',
    description: 'Sends a celebratory message and special offer on the member\'s birthday.',
    icon: MessageSquare,
    technicalDetails: 'Trigger: Birthday Reminder (daily 8 AM). Priority: High. Logic: Send birthday SMS with offer, tag "birthday-sent-[year]". No Zapier needed.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Birthday Reminder', description: 'Triggers daily at 8 AM.', hoverDetail: 'Checks the `birthday` custom field synced from MindBody.' },
      { id: 's2', type: 'action', title: 'Send Birthday SMS', description: 'Sends a happy birthday text.', hoverDetail: 'Includes a special offer (e.g., free smoothie or guest pass).' },
      { id: 's3', type: 'tag', title: 'Add Tag', description: 'Tags as "birthday-sent-[year]".', hoverDetail: 'Uses current year variable to ensure it only sends once per year.' },
      { id: 's4', type: 'end', title: 'End Workflow', description: 'Birthday message sent.', hoverDetail: 'Workflow completes.' }
    ]
  },
  {
    id: 'google-review',
    name: '8. Google Review Request',
    description: 'Automatically asks happy members for a Google review after a visit.',
    icon: Tag,
    technicalDetails: 'Trigger: Appointment Status = Completed. Priority: High. Logic: Wait 2h, send review request SMS + Google link, tag "review-requested".',
    steps: [
      { id: 's1', type: 'trigger', title: 'Appointment Completed', description: 'Member completes a class/session.', hoverDetail: 'Triggered when MindBody marks attendance as completed.' },
      { id: 's2', type: 'wait', title: 'Wait 2 Hours', description: 'Gives them time to cool down.', hoverDetail: 'Catches them while the positive endorphins are still high.' },
      { id: 's3', type: 'action', title: 'Send Review Request SMS', description: 'Sends a text with a Google review link.', hoverDetail: 'Uses GHL native review request action linked to GBP.' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "review-requested".', hoverDetail: 'Prevents asking the same member after every single class.' },
      { id: 's5', type: 'end', title: 'End Workflow', description: 'Review requested.', hoverDetail: 'Awaits review. GHL Reputation tab monitors responses.' }
    ]
  },
  {
    id: 'missed-call',
    name: '9. Missed Call Text-Back',
    description: 'Instantly texts back anyone whose call was missed by the front desk.',
    icon: MessageSquare,
    technicalDetails: 'Trigger: Call Status = Missed/No Answer. Priority: High. Logic: Wait 1 min, send SMS, tag "missed-call-textback-sent". If reply received, Conversation AI takes over.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Call Missed', description: 'An incoming call goes unanswered.', hoverDetail: 'Triggered by GHL phone system (Twilio).' },
      { id: 's2', type: 'wait', title: 'Wait 1 Minute', description: 'Waits briefly.', hoverDetail: 'Feels more human than an instant robotic reply.' },
      { id: 's3', type: 'action', title: 'Send Text-Back SMS', description: 'Sends: "Sorry we missed your call!"', hoverDetail: '"Want to book a class or have a question? Reply here."' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "missed-call-textback-sent".', hoverDetail: 'Prevents spam if they call back-to-back 5 times.' },
      { id: 's5', type: 'condition', title: 'If Reply Received', description: 'Did the caller text back?', hoverDetail: 'Listens for inbound SMS on the same thread.', branches: [
        { label: 'Yes', steps: [
          { id: 's5-y1', type: 'end', title: 'AI Takes Over', description: 'Conversation AI answers their question.', hoverDetail: 'AI attempts to book them for a trial.' }
        ]},
        { label: 'No', steps: [
          { id: 's5-n1', type: 'end', title: 'Wait for Response', description: 'Workflow ends, waiting for user.', hoverDetail: 'Staff can see the missed call in the Conversations tab.' }
        ]}
      ]}
    ]
  },
  {
    id: 'pt-drop-recovery',
    name: '10. PT Client Drop Recovery',
    description: 'Alerts staff immediately if a member cancels their Personal Training package.',
    icon: UserCircle,
    technicalDetails: 'Trigger: Tag Added "pt-cancelled". Priority: High. Logic: Create urgent task with PT context, tag "pt-drop-task-sent".',
    steps: [
      { id: 's1', type: 'trigger', title: 'PT Cancelled Tag Added', description: 'System detects PT package drop.', hoverDetail: 'Triggered by n8n Membership Change webhook.' },
      { id: 's2', type: 'task', title: 'Create Urgent Task', description: 'Assigns a task to call the client.', hoverDetail: 'Includes {{custom.last_pt_visit_date}} for context.' },
      { id: 's3', type: 'tag', title: 'Add Tag', description: 'Tags as "pt-drop-task-sent".', hoverDetail: 'Prevents duplicate tasks.' },
      { id: 's4', type: 'end', title: 'End Workflow', description: 'Staff handles the recovery.', hoverDetail: 'High-touch human intervention required to save the high-ticket client.' }
    ]
  }
];
