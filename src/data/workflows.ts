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
  FileText,
  Star,
  RefreshCw,
  Award,
  PhoneMissed,
  MessageCircle,
  FileCheck
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
  { name: 'milestone-10', description: 'Applied by Make on the 10th visit to trigger celebration.' },
  { name: 'milestone-50', description: 'Applied by Make on the 50th visit to trigger celebration.' },
  { name: 'pt-cancelled', description: 'Applied by Make when a PT package is cancelled in MindBody.' },
  { name: 'class-cancelled', description: 'Applied by Make when a class membership is cancelled in MindBody.' },
  { name: 'b2b-opportunity', description: 'Manually applied by staff to trigger a native GHL invoice task.' },
  { name: 'social-no-response', description: 'Applied after 72h of no reply to a social DM. Triggers staff task.' }
];

export const workflows: Workflow[] = [
  {
    id: 'new-lead-welcome',
    name: '1. New Lead Welcome',
    description: 'Instantly engages new leads with a welcome message and follow-up email.',
    icon: UserCircle,
    technicalDetails: 'Trigger: Contact Created in GHL. Priority: Critical. Logic: Send SMS immediately → wait 1h → send email. Add tag \'welcome-sent\'. Merge field: {{contact.first_name}}.',
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
    name: '2. Lead No-Response Follow-up',
    description: 'Follows up with leads who haven\'t replied to the initial welcome.',
    icon: Clock,
    technicalDetails: 'Trigger: Continues from Welcome. Priority: Critical. Logic: Wait 24h → check for reply → No: send follow-up SMS. Wait 72h → still no reply: tag \'no-response-72h\', create staff call task.',
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
    name: '3. Trial/Consult Booking Confirmation',
    description: 'Confirms trial bookings and sends reminders to ensure attendance.',
    icon: CalendarCheck,
    technicalDetails: 'Trigger: Appointment Status: Booked. Priority: Critical. Logic: Send confirmation SMS. Wait until 24h before → send reminder. Tag \'consult-booked\'. Move pipeline stage to \'Tour Scheduled\'.',
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
    technicalDetails: 'Trigger: Appointment Status: No Show. Priority: Critical. Logic: Wait 2h → send re-book SMS. Create staff call task. Tag \'no-show-contacted\'.',
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
    id: 'pipeline-stage-automation',
    name: '5. Pipeline Stage Automation',
    description: 'Automatically moves contacts through the pipeline based on key events.',
    icon: GitBranch,
    technicalDetails: 'Trigger: Opportunity Status Changed. Priority: Critical. Logic: Form submit → New Lead. Appt booked → Trial Started. Payment (via scenarioier) → Won (Active Member). Tag \'active-member\' halts all nurture.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Status Changed', description: 'A key event occurs.', hoverDetail: 'Form submit, appointment booked, or payment received.' },
      { id: 's2', type: 'condition', title: 'Determine Event', description: 'Which event occurred?', hoverDetail: 'Checks the source of the status change.', branches: [
        { label: 'Form Submit', steps: [
          { id: 's2-1', type: 'action', title: 'Move to New Lead', description: 'Pipeline stage updated.', hoverDetail: 'Starts New Lead Welcome workflow.' }
        ]},
        { label: 'Appt Booked', steps: [
          { id: 's2-2', type: 'action', title: 'Move to Trial Started', description: 'Pipeline stage updated.', hoverDetail: 'Triggers Trial Booking Confirmation.' }
        ]},
        { label: 'Payment Received', steps: [
          { id: 's2-3', type: 'action', title: 'Move to Won', description: 'Pipeline stage updated to Active Member.', hoverDetail: 'Triggered via Make Scenario 1.' },
          { id: 's2-4', type: 'tag', title: 'Tag active-member', description: 'Halts all lead nurture.', hoverDetail: 'CRITICAL: The kill switch for lead sequences.' }
        ]}
      ]}
    ]
  },
  {
    id: 'member-lapsed-14',
    name: '6. Member Lapsed 14 Days',
    description: 'Re-engages members who haven\'t visited the gym in 14 days.',
    icon: Clock,
    technicalDetails: 'Trigger: Inbound Webhook from Scenario 5. Priority: Critical. Logic: Check tag \'lapsed-14-sent\'. If absent: send re-engagement SMS. Add tag. No response 7 days: escalate to staff task.',
    steps: [
      { id: 's1', type: 'trigger', title: '14 Days Since Last Visit', description: 'System detects 14 days of inactivity.', hoverDetail: 'Triggered by daily Make check against MindBody attendance.' },
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
    id: 'member-lapsed-30',
    name: '7. Member Lapsed 30 Days',
    description: 'Stronger re-engagement for members who haven\'t visited in 30 days.',
    icon: Clock,
    technicalDetails: 'Trigger: Inbound Webhook from Scenario 5. Priority: Critical. Logic: Check tag \'lapsed-30-sent\'. If absent: send stronger offer SMS. Add tag. Create red-priority staff task.',
    steps: [
      { id: 's1', type: 'trigger', title: '30 Days Since Last Visit', description: 'System detects 30 days of inactivity.', hoverDetail: 'Triggered by daily Make check against MindBody attendance.' },
      { id: 's2', type: 'condition', title: 'Check Tags', description: 'Is "lapsed-30-sent" tag absent?', hoverDetail: 'Ensures we only send this once per lapse period.', branches: [
        { label: 'No (Tag Present)', steps: [
          { id: 's2-n1', type: 'end', title: 'Already Contacted', description: 'Prevents spamming the member.', hoverDetail: 'Workflow terminates early.' }
        ]},
        { label: 'Yes (Tag Absent)', steps: [
          { id: 's3', type: 'action', title: 'Send Strong Offer SMS', description: 'Sends a compelling offer text.', hoverDetail: 'Example: "Hey {{contact.first_name}}, come back this week for a free PT session!"' },
          { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "lapsed-30-sent".', hoverDetail: 'Locks out future 30-day alerts until tag is cleared.' },
          { id: 's5', type: 'task', title: 'Create Red-Priority Task', description: 'Alerts staff immediately.', hoverDetail: 'Priority: Urgent. High risk of churn.' },
          { id: 's6', type: 'end', title: 'End Workflow', description: 'Staff handles manually.', hoverDetail: 'Final attempt to save the member.' }
        ]}
      ]}
    ]
  },
  {
    id: 'payment-failure',
    name: '8. Payment Failure Alert',
    description: 'Urgently notifies members and staff when a payment fails.',
    icon: Zap,
    technicalDetails: 'Trigger: Inbound Webhook from Scenario 3. Priority: High. Logic: Send urgent SMS + email to member. Create red-priority staff task. Tag \'payment-failed-notified\'.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Payment Failed', description: 'System detects a failed payment.', hoverDetail: 'Triggered via Make webhook to GHL.' },
      { id: 's2', type: 'action', title: 'Send Urgent SMS & Email', description: 'Notifies the member of the failure.', hoverDetail: 'Includes a link to update billing info in MindBody.' },
      { id: 's3', type: 'task', title: 'Create Red-Priority Task', description: 'Alerts staff immediately.', hoverDetail: 'Priority: Urgent. Staff must follow up to prevent churn.' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "payment-failed-notified".', hoverDetail: 'Prevents spamming the member if the webhook fires twice.' },
      { id: 's5', type: 'end', title: 'End Workflow', description: 'Awaiting payment resolution.', hoverDetail: 'Member must update payment in MindBody.' }
    ]
  },
  {
    id: 'birthday-promotion',
    name: '9. Birthday Promotion',
    description: 'Sends a celebratory message and special offer on the member\'s birthday.',
    icon: MessageSquare,
    technicalDetails: 'Trigger: Birthday Reminder (daily 8 AM). Priority: High. Logic: Send birthday SMS with offer. Tag \'birthday-sent-[year]\'. No Make needed.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Birthday Reminder', description: 'Triggers daily at 8 AM.', hoverDetail: 'Checks the `birthday` custom field synced from MindBody.' },
      { id: 's2', type: 'action', title: 'Send Birthday SMS', description: 'Sends a happy birthday text.', hoverDetail: 'Includes a special offer (e.g., free smoothie or guest pass).' },
      { id: 's3', type: 'tag', title: 'Add Tag', description: 'Tags as "birthday-sent-[year]".', hoverDetail: 'Uses current year variable to ensure it only sends once per year.' },
      { id: 's4', type: 'end', title: 'End Workflow', description: 'Birthday message sent.', hoverDetail: 'Workflow completes.' }
    ]
  },
  {
    id: 'google-review',
    name: '10. Google Review Request',
    description: 'Automatically asks happy members for a Google review after a visit.',
    icon: Star,
    technicalDetails: 'Trigger: Appointment Status: Completed. Priority: High. Logic: Wait 2h → send review request SMS + Google link. Tag \'review-requested\'.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Appointment Completed', description: 'Member completes a class/session.', hoverDetail: 'Triggered when MindBody marks attendance as completed.' },
      { id: 's2', type: 'wait', title: 'Wait 2 Hours', description: 'Gives them time to cool down.', hoverDetail: 'Catches them while the positive endorphins are still high.' },
      { id: 's3', type: 'action', title: 'Send Review Request SMS', description: 'Sends a text with a Google review link.', hoverDetail: 'Uses GHL native review request action linked to GBP.' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "review-requested".', hoverDetail: 'Prevents asking the same member after every single class.' },
      { id: 's5', type: 'end', title: 'End Workflow', description: 'Review requested.', hoverDetail: 'Awaits review. GHL Reputation tab monitors responses.' }
    ]
  },
  {
    id: 'stale-lead-reengagement',
    name: '11. Stale Lead Re-engagement',
    description: 'Attempts to revive leads that have gone cold.',
    icon: RefreshCw,
    technicalDetails: 'Trigger: Stale Opportunity trigger. Priority: High. Logic: Re-engagement SMS sequence. No reply 7 days → move to \'Lost\'. Internal staff notification.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Stale Opportunity', description: 'Lead has been inactive for a set period.', hoverDetail: 'Triggered by GHL stale opportunity settings.' },
      { id: 's2', type: 'action', title: 'Send Re-engagement SMS', description: 'Sends a "still interested?" text.', hoverDetail: 'Example: "Hey {{contact.first_name}}, are you still looking to reach your fitness goals?"' },
      { id: 's3', type: 'wait', title: 'Wait 7 Days', description: 'Waits a week for a response.', hoverDetail: 'Gives them ample time to reply.' },
      { id: 's4', type: 'condition', title: 'Check for Reply', description: 'Did the lead reply?', hoverDetail: 'Condition: Has Replied = True/False', branches: [
        { label: 'Yes', steps: [
          { id: 's4-y1', type: 'end', title: 'AI Takes Over', description: 'Conversation AI handles the reply.', hoverDetail: 'Pipeline moves to "Contact Made".' }
        ]},
        { label: 'No', steps: [
          { id: 's5', type: 'action', title: 'Move to Lost', description: 'Updates pipeline stage.', hoverDetail: 'Marks the opportunity as Lost.' },
          { id: 's6', type: 'task', title: 'Notify Staff', description: 'Internal notification sent.', hoverDetail: 'Informs staff that the lead was marked lost.' },
          { id: 's7', type: 'end', title: 'End Workflow', description: 'Lead archived.', hoverDetail: 'Workflow completes.' }
        ]}
      ]}
    ]
  },
  {
    id: '10th-visit-milestone',
    name: '12. 10th Visit Milestone',
    description: 'Celebrates a member\'s 10th visit and asks for a review.',
    icon: Award,
    technicalDetails: 'Trigger: Tag Added: milestone-10 (from Scenario 2). Priority: Medium. Logic: Send celebration SMS + review request. Tag \'review-requested\'. Triggered by visit count from Make.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Tag Added: milestone-10', description: 'Member hits 10 visits.', hoverDetail: 'Triggered by Make Attendance Sync (Scenario 2).' },
      { id: 's2', type: 'action', title: 'Send Celebration SMS', description: 'Sends a congratulatory text.', hoverDetail: 'Example: "Congrats on your 10th visit, {{contact.first_name}}!"' },
      { id: 's3', type: 'action', title: 'Request Review', description: 'Includes a Google review link.', hoverDetail: 'Capitalizes on the positive milestone.' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "review-requested".', hoverDetail: 'Prevents duplicate review requests.' },
      { id: 's5', type: 'end', title: 'End Workflow', description: 'Milestone celebrated.', hoverDetail: 'Workflow completes.' }
    ]
  },
  {
    id: 'pt-drop-recovery',
    name: '13. PT Client Drop Recovery',
    description: 'Alerts staff immediately if a member cancels their Personal Training package.',
    icon: UserCircle,
    technicalDetails: 'Trigger: Tag Added: pt-cancelled. Priority: High. Logic: Create urgent task: "Call {{contact.first_name}} {{contact.last_name}} — dropped PT but still active on classes..." Tag pt-drop-task-sent.',
    steps: [
      { id: 's1', type: 'trigger', title: 'PT Cancelled Tag Added', description: 'System detects PT package drop.', hoverDetail: 'Triggered by Make Membership Change webhook.' },
      { id: 's2', type: 'task', title: 'Create Urgent Task', description: 'Assigns a task to call the client.', hoverDetail: 'Includes {{custom.last_pt_visit_date}} for context.' },
      { id: 's3', type: 'tag', title: 'Add Tag', description: 'Tags as "pt-drop-task-sent".', hoverDetail: 'Prevents duplicate tasks.' },
      { id: 's4', type: 'end', title: 'End Workflow', description: 'Staff handles the recovery.', hoverDetail: 'High-touch human intervention required to save the high-ticket client.' }
    ]
  },
  {
    id: 'missed-call',
    name: '14. Missed Call Text-Back',
    description: 'Instantly texts back anyone whose call was missed by the front desk.',
    icon: PhoneMissed,
    technicalDetails: 'Trigger: Call Status: Missed/No Answer. Priority: High. Logic: Wait 1 min → send SMS: "Hey {{contact.first_name}}, sorry we missed your call!..." Tag missed-call-textback-sent. If reply received → Conversation AI takes over.',
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
    id: 'reputation-review-request',
    name: '15. Reputation: Review Request',
    description: 'Sends a Google review link after an appointment is completed.',
    icon: Star,
    technicalDetails: 'Trigger: Appointment Status: Completed. Priority: High. Logic: Wait 2h → send SMS with Google review link. Tag review-requested. Use GHL\'s native review request action linked to GBP. Monitor responses in Reputation tab.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Appointment Completed', description: 'Member completes a class/session.', hoverDetail: 'Triggered when MindBody marks attendance as completed.' },
      { id: 's2', type: 'wait', title: 'Wait 2 Hours', description: 'Gives them time to cool down.', hoverDetail: 'Catches them while the positive endorphins are still high.' },
      { id: 's3', type: 'action', title: 'Send Review Request SMS', description: 'Sends a text with a Google review link.', hoverDetail: 'Uses GHL native review request action linked to GBP.' },
      { id: 's4', type: 'tag', title: 'Add Tag', description: 'Tags as "review-requested".', hoverDetail: 'Prevents asking the same member after every single class.' },
      { id: 's5', type: 'end', title: 'End Workflow', description: 'Review requested.', hoverDetail: 'Awaits review. GHL Reputation tab monitors responses.' }
    ]
  },
  {
    id: 'reputation-review-auto-response',
    name: '16. Reputation: Review Auto-Response',
    description: 'Auto-drafts replies to new Google Reviews.',
    icon: MessageCircle,
    technicalDetails: 'Trigger: New Google Review Received. Priority: Medium. Logic: Conversation AI auto-drafts reply (Suggestive mode → admin approves before posting). For 4-5 star: thank + invite back. For 1-3 star: create urgent GHL task for Coach T to respond personally.',
    steps: [
      { id: 's1', type: 'trigger', title: 'New Review Received', description: 'A new Google Review is posted.', hoverDetail: 'Triggered by GBP integration.' },
      { id: 's2', type: 'condition', title: 'Check Star Rating', description: 'Is it 4-5 stars or 1-3 stars?', hoverDetail: 'Determines the response strategy.', branches: [
        { label: '4-5 Stars', steps: [
          { id: 's2-y1', type: 'action', title: 'Auto-Draft Reply', description: 'AI drafts a thank you message.', hoverDetail: 'Admin approves before posting.' },
          { id: 's2-y2', type: 'end', title: 'End Workflow', description: 'Reply posted.', hoverDetail: 'Workflow completes.' }
        ]},
        { label: '1-3 Stars', steps: [
          { id: 's2-n1', type: 'task', title: 'Create Urgent Task', description: 'Alerts Coach T to respond.', hoverDetail: 'Priority: Urgent. Requires personal attention.' },
          { id: 's2-n2', type: 'end', title: 'End Workflow', description: 'Staff handles manually.', hoverDetail: 'Workflow completes.' }
        ]}
      ]}
    ]
  },
  {
    id: 'conversation-ai-sms',
    name: '17. Conversation AI: SMS Suggestive Mode',
    description: 'Enables AI to draft replies for inbound SMS.',
    icon: MessageSquare,
    technicalDetails: 'Trigger: Inbound SMS Received. Priority: Medium. Logic: Enable Suggestive mode on SMS channel. AI drafts reply → admin sees suggestion → taps to send or edits. Faster response times, consistent tone. Not a workflow → a GHL setting to enable.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Inbound SMS Received', description: 'A contact sends an SMS.', hoverDetail: 'Triggered by inbound message.' },
      { id: 's2', type: 'action', title: 'AI Drafts Reply', description: 'Conversation AI generates a response.', hoverDetail: 'Based on trained knowledge base.' },
      { id: 's3', type: 'task', title: 'Admin Review', description: 'Admin reviews the suggested reply.', hoverDetail: 'Can tap to send or edit before sending.' },
      { id: 's4', type: 'end', title: 'End Workflow', description: 'Reply sent.', hoverDetail: 'Workflow completes.' }
    ]
  },
  {
    id: 'invoice-b2b-deals',
    name: '18. Invoice for B2B Deals',
    description: 'Creates a task to send an invoice for corporate group rate inquiries.',
    icon: FileCheck,
    technicalDetails: 'Trigger: Tag Added: b2b-opportunity. Priority: Low. Logic: When a contact is tagged b2b-opportunity, create a GHL task: "Send invoice to {{contact.first_name}} {{contact.last_name}} — B2B deal." Use GHL native Invoicing to send.',
    steps: [
      { id: 's1', type: 'trigger', title: 'Tag Added: b2b-opportunity', description: 'Staff tags a contact for a B2B deal.', hoverDetail: 'Triggered manually by staff.' },
      { id: 's2', type: 'task', title: 'Create Invoice Task', description: 'Alerts staff to send an invoice.', hoverDetail: 'Task: "Send invoice to {{contact.first_name}} {{contact.last_name}} — B2B deal."' },
      { id: 's3', type: 'end', title: 'End Workflow', description: 'Staff sends invoice.', hoverDetail: 'Uses GHL native Invoicing (Payments → Invoices).' }
    ]
  }
];

