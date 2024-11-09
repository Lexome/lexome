import { enhancement, EnhancementType } from "@prisma/client";
import { prisma } from "../../../prisma";

export const updateEnhancementTypes = async (params: {
  enhancement: enhancement,
  types: EnhancementType[]
}) => {
  const { enhancement, types } = params

  const typesToAdd = types.filter(type => !enhancement.included_types.includes(type))

  if (typesToAdd.length > 0) {
    await prisma.enhancement.update({
      where: {
        id: enhancement.id,
      },
      data: {
        included_types: [
          ...enhancement.included_types,
          ...typesToAdd
        ]
      }
    })
  }
}