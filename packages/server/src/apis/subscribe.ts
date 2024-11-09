// An simple express server that handles subscribing to the newsletter

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // TODO: Subscribe to newsletter

  return res.status(200).json({ message: "Subscribed" });
}