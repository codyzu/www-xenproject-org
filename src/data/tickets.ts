import yaml from 'js-yaml';
import {z} from 'zod';
import tickets2025Yaml from '../../data/tickets-2025.yaml?raw';
import tickets2026Yaml from '../../data/tickets-2026.yaml?raw';

const optionalUrl = z.string().url().optional();

const ticketSchema = z.object({
  title: z.string().min(1),
  price: z.string().min(1),
  description: z.string().min(1),
  enabled: z.boolean().optional().default(true),
  link: optionalUrl,
  linkText: z.string().min(1).optional(),
});

const ticketSetSchema = z.object({
  tickets: z.object({
    inPerson: z.array(ticketSchema),
    virtual: z.array(ticketSchema),
  }),
});

export type Ticket = z.infer<typeof ticketSchema>;
export type TicketSet = z.infer<typeof ticketSetSchema>;

export const ticketSets = {
  'tickets-2025': ticketSetSchema.parse(yaml.load(tickets2025Yaml)),
  'tickets-2026': ticketSetSchema.parse(yaml.load(tickets2026Yaml)),
} as const;
