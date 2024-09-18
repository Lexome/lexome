import { User } from "../../user";

export const getUserRole = ({
  enhancementId,
  user
}:{
  enhancementId: string,
  user: User
}) => {
  const subscriptions = user.subscriptions.filter(sub => {
    sub.enhancement_id === enhancementId
  });

  if (subscriptions.length === 0) {
    return new Error('User unauthorized')
  }

  if (subscriptions.length > 1) {
    throw new Error('Multiple subscriptions found')
  }

  const subscription = subscriptions[0]
  return subscription.role
}