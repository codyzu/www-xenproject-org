import {z} from 'zod';

const jobSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  stage: z.object({name: z.string()}).nullable(),
  detailedStatus: z.object({
    label: z.string(),
    favicon: z.string(),
  }),
});

export type Job = z.infer<typeof jobSchema>;

export const groupSchema = z.object({
  name: z.string(),
  jobs: z.object({
    nodes: z.array(jobSchema),
  }),
});

export const stageSchema = z.object({
  name: z.string(),
  groups: z.object({
    nodes: z.array(groupSchema),
  }),
});

export const pipelineSchema = z.object({
  id: z.string(),
  iid: z.string(),
  source: z.string(),
  duration: z.number().nullable(),
  status: z.string(),
  createdAt: z.string(),
  detailedStatus: z.object({
    label: z.string(),
  }),
  stages: z
    .object({
      nodes: z.array(stageSchema),
    })
    .nullable(),
});

export type Pipeline = z.infer<typeof pipelineSchema>;

export const graphQlResponseSchema = z.object({
  data: z.object({
    project: z
      .object({
        pipelines: z
          .object({
            nodes: z.array(pipelineSchema),
          })
          .nullable(),
      })
      .nullable(),
  }),
});

export type GraphQlResponse = z.infer<typeof graphQlResponseSchema>;

export type ParsedJobTokens = {
  platform: string;
  friendlyPlatform: string;
  arch: string;
  compiler?: string;
  // Mode?: string;
  variant?: string[];
  icons: string[];
  name: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
};

export type ParsedJob = z.infer<typeof jobSchema> & {
  parsed: ParsedJobTokens;
};
