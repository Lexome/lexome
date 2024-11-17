export type ChunkHandler<Response> = (params: {
  chunk: string,
  aggregate: Response,
  chunkIndex: number,
}) => Promise<Response> 

export type ChunkPipelineProcessor<Response> = (chunks: string[]) => Promise<Response>

export const createChunkPipelineProcessor = <Response>({
  chunkHandler,
  initialAggregate
}: {
  chunkHandler: ChunkHandler<Response>,
  initialAggregate: Response
}): ChunkPipelineProcessor<Response> => {
  return async (chunks: string[]) => {
    let aggregate: Response = initialAggregate

    for (const [index, chunk] of chunks.entries()) {
      const result = await chunkHandler({ chunk, aggregate, chunkIndex: index })
      aggregate = result
    }

    return aggregate
  }
}