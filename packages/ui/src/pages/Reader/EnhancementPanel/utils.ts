export const getAuthorName = ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  const first = (firstName || 'Anonymous').trim();
  if (lastName) return `${first} ${lastName}`;
  return first;
}

export const ANONYMOUS_USER_ID = '2';

export const getNameInitials = (name: string) => {
  const nameParts = name.trim().split(' ');
  if (nameParts.length === 1) {
    return nameParts[0][0];
  } else {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
  }
};