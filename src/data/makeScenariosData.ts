export type AppType = 'mindbody' | 'ghl' | 'tools' | 'router' | 'webhook' | 'formula' | 'flow';

export interface MakeNodeData {
  id: string;
  app: AppType;
  title: string;
  subtitle: string;
  isPolling?: boolean;
  executionOrder?: number;
  config?: Record<string, any>;
  input?: Record<string, any>;
  output?: Record<string, any>;
}

export interface MakeBranch {
  id: string;
  filter?: string;
  nodes: MakeNodeData[];
}

export interface MakeScenario {
  id: string;
  name: string;
  trigger: MakeNodeData;
  nodes: MakeNodeData[];
  branches?: MakeBranch[];
}

export const makeScenariosData: MakeScenario[] = [
  {
    id: 's1',
    name: '1. New Member Sync',
    trigger: { 
      id: 'n1', 
      app: 'mindbody', 
      title: 'Mindbody', 
      subtitle: 'Watch New Clients', 
      isPolling: true, 
      executionOrder: 1,
      config: {
        'Connection': 'My Mindbody Connection',
        'Site ID': '123456',
        'Limit': 10
      },
      output: {
        'Bundle 1': {
          'ClientID': '10045',
          'FirstName': 'John',
          'LastName': 'Doe',
          'Email': 'john.doe@example.com',
          'Phone': '+15550198',
          'CreationDate': '2023-10-25T10:00:00Z'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.Email}}',
          'Limit': 1
        },
        input: {
          'Query': 'john.doe@example.com',
          'Limit': 1
        },
        output: {
          'Bundle 1': {
            'contacts': []
          }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Create a Contact', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'First Name': '{{1.FirstName}}',
          'Last Name': '{{1.LastName}}',
          'Email': '{{1.Email}}',
          'Phone': '{{1.Phone}}',
          'Tags': ['New Member', 'Mindbody Sync']
        },
        input: {
          'First Name': 'John',
          'Last Name': 'Doe',
          'Email': 'john.doe@example.com',
          'Phone': '+15550198',
          'Tags': ['New Member', 'Mindbody Sync']
        },
        output: {
          'Bundle 1': {
            'contact': {
              'id': 'ghl_contact_98765',
              'firstName': 'John',
              'lastName': 'Doe',
              'email': 'john.doe@example.com',
              'phone': '+15550198',
              'tags': ['New Member', 'Mindbody Sync']
            }
          }
        }
      }
    ]
  },
  {
    id: 's2',
    name: '2. Client Update Sync',
    trigger: { 
      id: 'n1', 
      app: 'mindbody', 
      title: 'Mindbody', 
      subtitle: 'Watch Updated Clients', 
      isPolling: true, 
      executionOrder: 1,
      config: {
        'Connection': 'My Mindbody Connection',
        'Site ID': '123456',
        'Limit': 10
      },
      output: {
        'Bundle 1': {
          'ClientID': '10045',
          'FirstName': 'John',
          'LastName': 'Doe',
          'Email': 'john.doe.new@example.com',
          'Phone': '+15550198',
          'LastModifiedDateTime': '2023-10-26T14:30:00Z'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.Email}}',
          'Limit': 1
        },
        input: {
          'Query': 'john.doe.new@example.com',
          'Limit': 1
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765',
                'email': 'john.doe@example.com'
              }
            ]
          }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Update a Contact', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{2.contacts[].id}}',
          'Email': '{{1.Email}}',
          'Phone': '{{1.Phone}}'
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Email': 'john.doe.new@example.com',
          'Phone': '+15550198'
        },
        output: {
          'Bundle 1': {
            'contact': {
              'id': 'ghl_contact_98765',
              'email': 'john.doe.new@example.com',
              'phone': '+15550198',
              'updatedAt': '2023-10-26T14:30:05Z'
            }
          }
        }
      }
    ]
  },
  {
    id: 's3',
    name: '3. Class Attendance Sync',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Class Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_123',
          'eventType': 'class.attendance.updated',
          'clientId': '10045',
          'classId': 'cls_888',
          'status': 'Signed In',
          'timestamp': '2023-10-27T08:00:00Z'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765',
                'customFields': {
                  'total_visits': 41
                }
              }
            ]
          }
        }
      },
      { 
        id: 'n3', 
        app: 'formula', 
        title: 'Formula', 
        subtitle: 'Calculate Attendance Score', 
        executionOrder: 1,
        config: {
          'Formula': '{{2.contacts[].customFields.total_visits}} + 1'
        },
        input: {
          'Value 1': 41,
          'Value 2': 1,
          'Operator': '+'
        },
        output: {
          'Bundle 1': {
            'result': 42
          }
        }
      },
      { 
        id: 'n4', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Update a Contact', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{2.contacts[].id}}',
          'Custom Fields': {
            'Total Visits': '{{3.result}}',
            'Last Visit Date': '{{1.timestamp}}'
          }
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Custom Fields': {
            'Total Visits': 42,
            'Last Visit Date': '2023-10-27T08:00:00Z'
          }
        },
        output: {
          'Bundle 1': {
            'contact': {
              'id': 'ghl_contact_98765',
              'customFields': {
                'total_visits': 42,
                'last_visit_date': '2023-10-27T08:00:00Z'
              }
            }
          }
        }
      }
    ]
  },
  {
    id: 's4',
    name: '4. Payment Failure Alert',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Payment Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_456',
          'eventType': 'payment.failed',
          'clientId': '10045',
          'amount': 150.00,
          'currency': 'USD',
          'reason': 'insufficient_funds'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765',
                'assignedTo': 'user_123'
              }
            ]
          }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Create a Task', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{2.contacts[].id}}',
          'Title': 'Payment Failed - Follow Up',
          'Description': 'Payment of {{1.amount}} {{1.currency}} failed due to {{1.reason}}.',
          'Assigned To': '{{2.contacts[].assignedTo}}',
          'Due Date': '{{now + 1 day}}'
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Title': 'Payment Failed - Follow Up',
          'Description': 'Payment of 150 USD failed due to insufficient_funds.',
          'Assigned To': 'user_123',
          'Due Date': '2023-10-28T00:00:00Z'
        },
        output: {
          'Bundle 1': {
            'task': {
              'id': 'task_777',
              'title': 'Payment Failed - Follow Up',
              'status': 'pending'
            }
          }
        }
      },
      { 
        id: 'n4', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Update a Contact', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{2.contacts[].id}}',
          'Tags': ['Payment Failed']
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Tags': ['Payment Failed']
        },
        output: {
          'Bundle 1': {
            'contact': {
              'id': 'ghl_contact_98765',
              'tags': ['New Member', 'Mindbody Sync', 'Payment Failed']
            }
          }
        }
      }
    ]
  },
  {
    id: 's5',
    name: '5. No-Show / Late Cancel',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Class Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_789',
          'eventType': 'class.attendance.updated',
          'clientId': '10045',
          'classId': 'cls_888',
          'status': 'No Show',
          'timestamp': '2023-10-27T08:00:00Z'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765'
              }
            ]
          }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Add a Note to the Contact', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{2.contacts[].id}}',
          'Body': 'Client marked as {{1.status}} for class {{1.classId}} on {{1.timestamp}}.'
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Body': 'Client marked as No Show for class cls_888 on 2023-10-27T08:00:00Z.'
        },
        output: {
          'Bundle 1': {
            'note': {
              'id': 'note_111',
              'body': 'Client marked as No Show for class cls_888 on 2023-10-27T08:00:00Z.',
              'contactId': 'ghl_contact_98765'
            }
          }
        }
      }
    ]
  },
  {
    id: 's6',
    name: '6. Membership Change Routing',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Contract Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_101',
          'eventType': 'contract.updated',
          'clientId': '10045',
          'contractId': 'con_222',
          'status': 'Terminated',
          'type': 'Class Pass'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765'
              }
            ]
          }
        }
      }
    ],
    branches: [
      {
        id: 'b1',
        filter: 'Class Cancelled',
        nodes: [{ 
          id: 'n3', 
          app: 'ghl', 
          title: 'GoHighLevel', 
          subtitle: 'Update a Contact', 
          executionOrder: 1,
          config: {
            'Connection': 'YBX Fitness GHL',
            'Contact ID': '{{2.contacts[].id}}',
            'Tags': ['Class Cancelled']
          },
          input: {
            'Contact ID': 'ghl_contact_98765',
            'Tags': ['Class Cancelled']
          },
          output: {
            'Bundle 1': {
              'contact': {
                'id': 'ghl_contact_98765',
                'tags': ['Class Cancelled']
              }
            }
          }
        }]
      },
      {
        id: 'b2',
        filter: 'PT Cancelled',
        nodes: [{ 
          id: 'n4', 
          app: 'ghl', 
          title: 'GoHighLevel', 
          subtitle: 'Update a Contact', 
          executionOrder: 1,
          config: {
            'Connection': 'YBX Fitness GHL',
            'Contact ID': '{{2.contacts[].id}}',
            'Tags': ['PT Cancelled']
          },
          input: {
            'Contact ID': 'ghl_contact_98765',
            'Tags': ['PT Cancelled']
          },
          output: {
            'Bundle 1': {
              'contact': {
                'id': 'ghl_contact_98765',
                'tags': ['PT Cancelled']
              }
            }
          }
        }]
      }
    ]
  },
  {
    id: 's7',
    name: '7. Daily Lapsed Member Check',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Daily CRON Trigger',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'timestamp': '2023-10-28T00:00:00Z',
          'action': 'run_lapsed_check'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'flow', 
        title: 'Flow Control', 
        subtitle: 'Iterator', 
        executionOrder: 1,
        config: {
          'Array': '{{1.lapsedClients}}'
        },
        input: {
          'Array': [
            { 'clientId': '10045' },
            { 'clientId': '10046' }
          ]
        },
        output: {
          'Bundle 1': { 'clientId': '10045' },
          'Bundle 2': { 'clientId': '10046' }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{2.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              { 'id': 'ghl_contact_98765' }
            ]
          }
        }
      },
      { 
        id: 'n4', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Update a Contact', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{3.contacts[].id}}',
          'Tags': ['Lapsed Member']
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Tags': ['Lapsed Member']
        },
        output: {
          'Bundle 1': {
            'contact': {
              'id': 'ghl_contact_98765',
              'tags': ['Lapsed Member']
            }
          }
        }
      }
    ]
  },
  {
    id: 's8',
    name: '8. New Appointment Sync',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Appointment Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_555',
          'eventType': 'appointment.booked',
          'clientId': '10045',
          'appointmentId': 'apt_999',
          'serviceName': '1-on-1 Personal Training',
          'staffName': 'Coach Sarah',
          'startDateTime': '2023-11-01T10:00:00Z'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Opportunities', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Pipeline': 'PT Sales',
          'Query': '{{1.clientId}}'
        },
        input: {
          'Pipeline': 'PT Sales',
          'Query': '10045'
        },
        output: {
          'Bundle 1': {
            'opportunities': []
          }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Create an Opportunity', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Pipeline': 'PT Sales',
          'Stage': 'Appointment Booked',
          'Contact ID': '{{1.clientId}}',
          'Name': '{{1.serviceName}} - {{1.clientId}}'
        },
        input: {
          'Pipeline': 'PT Sales',
          'Stage': 'Appointment Booked',
          'Contact ID': '10045',
          'Name': '1-on-1 Personal Training - 10045'
        },
        output: {
          'Bundle 1': {
            'opportunity': {
              'id': 'opp_444',
              'name': '1-on-1 Personal Training - 10045',
              'stage': 'Appointment Booked'
            }
          }
        }
      }
    ]
  },
  {
    id: 's9',
    name: '9. PT Drop Recovery',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Appointment Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_666',
          'eventType': 'appointment.cancelled',
          'clientId': '10045',
          'appointmentId': 'apt_999',
          'serviceName': '1-on-1 Personal Training',
          'reason': 'Client requested'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765',
                'assignedTo': 'user_123'
              }
            ]
          }
        }
      },
      { 
        id: 'n3', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Create a Task', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Contact ID': '{{2.contacts[].id}}',
          'Title': 'PT Cancelled - Follow Up',
          'Description': 'Client cancelled {{1.serviceName}}. Reason: {{1.reason}}.',
          'Assigned To': '{{2.contacts[].assignedTo}}',
          'Due Date': '{{now}}'
        },
        input: {
          'Contact ID': 'ghl_contact_98765',
          'Title': 'PT Cancelled - Follow Up',
          'Description': 'Client cancelled 1-on-1 Personal Training. Reason: Client requested.',
          'Assigned To': 'user_123',
          'Due Date': '2023-10-27T00:00:00Z'
        },
        output: {
          'Bundle 1': {
            'task': {
              'id': 'task_888',
              'title': 'PT Cancelled - Follow Up',
              'status': 'pending'
            }
          }
        }
      }
    ]
  },
  {
    id: 's10',
    name: '10. Milestone Celebration',
    trigger: { 
      id: 'n1', 
      app: 'webhook', 
      title: 'Webhooks', 
      subtitle: 'Custom webhook', 
      executionOrder: 1,
      config: {
        'Webhook': 'Mindbody Class Webhook',
        'IP restrictions': 'None'
      },
      output: {
        'Bundle 1': {
          'eventId': 'evt_123',
          'eventType': 'class.attendance.updated',
          'clientId': '10045',
          'status': 'Signed In'
        }
      }
    },
    nodes: [
      { 
        id: 'n2', 
        app: 'ghl', 
        title: 'GoHighLevel', 
        subtitle: 'Search Contacts', 
        executionOrder: 1,
        config: {
          'Connection': 'YBX Fitness GHL',
          'Query': '{{1.clientId}}',
          'Search Field': 'Mindbody ID'
        },
        input: {
          'Query': '10045',
          'Search Field': 'Mindbody ID'
        },
        output: {
          'Bundle 1': {
            'contacts': [
              {
                'id': 'ghl_contact_98765',
                'customFields': {
                  'total_visits': 10
                }
              }
            ]
          }
        }
      },
      { 
        id: 'n3', 
        app: 'tools', 
        title: 'Tools', 
        subtitle: 'Set multiple variables', 
        executionOrder: 1,
        config: {
          'Variables': [
            { 'Name': 'currentVisits', 'Value': '{{2.contacts[].customFields.total_visits}}' }
          ]
        },
        input: {
          'Variables': [
            { 'Name': 'currentVisits', 'Value': 10 }
          ]
        },
        output: {
          'Bundle 1': {
            'currentVisits': 10
          }
        }
      }
    ],
    branches: [
      {
        id: 'b1',
        filter: '10 Visits',
        nodes: [{ 
          id: 'n4', 
          app: 'ghl', 
          title: 'GoHighLevel', 
          subtitle: 'Add a Contact to a Campaign', 
          executionOrder: 1,
          config: {
            'Connection': 'YBX Fitness GHL',
            'Contact ID': '{{2.contacts[].id}}',
            'Campaign ID': 'camp_10_visits'
          },
          input: {
            'Contact ID': 'ghl_contact_98765',
            'Campaign ID': 'camp_10_visits'
          },
          output: {
            'Bundle 1': {
              'success': true
            }
          }
        }]
      },
      {
        id: 'b2',
        filter: '50 Visits',
        nodes: [{ 
          id: 'n5', 
          app: 'ghl', 
          title: 'GoHighLevel', 
          subtitle: 'Add a Contact to a Campaign', 
          executionOrder: 1,
          config: {
            'Connection': 'YBX Fitness GHL',
            'Contact ID': '{{2.contacts[].id}}',
            'Campaign ID': 'camp_50_visits'
          },
          input: {
            'Contact ID': 'ghl_contact_98765',
            'Campaign ID': 'camp_50_visits'
          },
          output: {
            'Bundle 1': {
              'success': true
            }
          }
        }]
      }
    ]
  }
];
