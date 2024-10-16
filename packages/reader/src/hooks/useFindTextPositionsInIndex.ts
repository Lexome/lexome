import { useSharedState } from "@/hooks/useSharedState"
import { useBookMetadata } from "./data/useBookMetadata"
import { createHashes } from "@lexome/core"

type FindTextPositionsInIndex = (text: string) => Promise<{
  positions: number[]
  startCursor: number
  endCursor: number
}>

const checkArrayForRepeatedElement = (arr: number[]) => {
  const uniquePositions = new Set(arr)

  for (const el of arr) {
    if (uniquePositions.has(el)) {
      return el
    }
    uniquePositions.add(el)
  }

  return null
}

const backfillArrayFromLastElement = (arr: number[]): number[] => {
  const lastElement = arr[arr.length - 1]
  const reversedArray = [lastElement]

  while (reversedArray.length < arr.length) {
    reversedArray.push(reversedArray[reversedArray.length - 1] - 1)
  }

  const backfilled = reversedArray.reverse()

  return backfilled
}

export const useFindIndexPositionUsingHash = ({
  prefixHash,
  suffixHash,
  prefixHashComplete,
  suffixHashComplete
}: {
  prefixHash: string
  suffixHash: string
  prefixHashComplete: boolean
  suffixHashComplete: boolean
}) => {
  const {data: bookMetadata, isLoading: isBookMetadataLoading} = useBookMetadata()
  const hashIndex = bookMetadata?.hashIndex

  return async (text: string) => {
    let positions: number[] = []
    let isPositionCertain = false
  }
}

// Find the positions of the text within the index of words
export const useFindTextPositionsInIndex = () => {
  const {data: bookMetadata, isLoading: isBookMetadataLoading} = useBookMetadata()
  const hashIndex = bookMetadata?.hashIndex

  return async (text: string) => {
    let positions: number[] = []
    let isPositionCertain = false

    const addPositionWithCertainty = (position: number) => {
      positions.push(position)

      if (!isPositionCertain && positions.length > 1) {
        positions = backfillArrayFromLastElement(positions)
      }

      isPositionCertain = true
    }

    if (isBookMetadataLoading || !hashIndex) return {
      positions: [],
      startCursor: 0,
      endCursor: 0
    }

    const hashes = await createHashes({text})

    for (const hash of hashes) {
      // If we already have a certain position, we know the remaining positions
      // are sequential, so we can just keep adding them
      if (isPositionCertain) {
        const lastPosition = positions[positions.length - 1]
        positions.push(lastPosition + 1)
        continue
      }

      const completePositions: number[] = []
      const incompletePositions: number[] = []

      // If either the prefix or suffix hash is complete and unique, we know the position is certain
      if (
        hash.prefixHash &&
        hashIndex.prefixHashOrdering[hash.prefixHash]
      ) {
        const prefixPositions = hashIndex.prefixHashOrdering[hash.prefixHash]

        if (
          hash.prefixHashComplete &&
          prefixPositions.length === 1
        ) {
          addPositionWithCertainty(prefixPositions[0])
          continue
        }

        if (
          hash.prefixHashComplete &&
          prefixPositions.length > 1
        ) {
          completePositions.push(...prefixPositions)
        } else {
          incompletePositions.push(...prefixPositions)
        }
      }

      if (
        hash.suffixHash &&
        hashIndex.suffixHashOrdering[hash.suffixHash]
      ) {
        const suffixPositions = hashIndex.suffixHashOrdering[hash.suffixHash]

        if (
          hash.suffixHashComplete &&
          suffixPositions.length === 1
        ) {
          addPositionWithCertainty(suffixPositions[0])
          continue
        }

        if (
          hash.suffixHashComplete &&
          suffixPositions.length > 1
        ) {
          completePositions.push(...suffixPositions)
        } else {
          incompletePositions.push(...suffixPositions)
        }
      }

      if (completePositions.length > 0) {
        const repeatedPosition = checkArrayForRepeatedElement(completePositions)
        if (repeatedPosition) {
          addPositionWithCertainty(repeatedPosition)
        } else {
          positions.push(completePositions[0])
          backfillArrayFromLastElement(positions)
        }
      }

      if (incompletePositions.length > 0) {
        positions.push(incompletePositions[0])
      }
    }

    return {
      positions,
      startCursor: positions[0],
      endCursor: positions[positions.length - 1]
    }
  }
}