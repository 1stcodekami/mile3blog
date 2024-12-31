import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../sanity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { postId } = req.query;

    if (!postId) {
      res.status(400).json({ error: 'Missing postId query parameter' });
      return;
    }

    try {
      // Fetch comments from your database or CMS
      const comments = await sanityClient.fetch(
        `*[_type == "comment" && post._ref == $postId && approved == true]`,
        { postId }
      );
      console.log('Fetched comments:', comments); 
      res.status(200).json({ comments });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
