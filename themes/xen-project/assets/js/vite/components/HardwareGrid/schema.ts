import { z } from 'zod';

export const PipelineSchema = z.object({
  id: z.string(),
  iid: z.string(),
  source: z.string(),
  jobs: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        stage: z.object({ name: z.string() }).nullable(),
        detailedStatus: z.object({
          label: z.string(),
          favicon: z.string(),
        }),
      })
    ),
  }),
});

export type Pipeline = z.infer<typeof PipelineSchema>;

export const GraphQLResponseSchema = z.object({
  data: z.object({
    project: z
      .object({
        pipelines: z
          .object({
            pageInfo: z.object({
              endCursor: z.string().nullable(),
              hasNextPage: z.boolean(),
            }),
            nodes: z.array(PipelineSchema),
          })
          .nullable(),
      })
      .nullable(),
  }),
});

export type GraphQLResponse = z.infer<typeof GraphQLResponseSchema>;

export type ParsedJobTokens = {
  platform: string;
  friendlyPlatform: string;
  arch: string;
  compiler?: string;
  // mode?: string;
  variant?: string[];
  icons: string[];
  name: string;
};

export type ParsedJob = Pipeline['jobs']['nodes'][number] & {
  parsed: ParsedJobTokens;
};

