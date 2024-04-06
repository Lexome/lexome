export const sendTextMessage = async (
  messageBody: string,
) => {
  fetch('https://xd23yrzsny2olthyl5daomlfwy0eqnfe.lambda-url.us-west-2.on.aws/', {
    method: 'POST',
    body: JSON.stringify({
      message: messageBody
    })
  });
};

