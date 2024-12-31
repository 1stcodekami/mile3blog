// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'next-sanity';

const client = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  useCdn: false, // Set to false for write operations
  token: process.env.SANITY_API_TOKEN!,
});

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate and parse the request body
  let parsedBody;
try {
  if (!req.body) {
    throw new Error('Request body is required');
  }
  parsedBody = JSON.parse(req.body);
} catch (error) {
  if (error instanceof Error) {
    return res.status(400).json({ 
      message: 'Invalid JSON input', 
      error: error.message 
    });
  }
  return res.status(400).json({ 
    message: 'Invalid JSON input', 
    error: 'Unknown error' 
  });
}


  const { _id, name, email, comment } = parsedBody;

  // Validate required fields
  if (!_id || !name || !email || !comment) {
    return res.status(400).json({
      message: 'Missing required fields: _id, name, email, comment',
    });
  }

  try {
    // Create a new comment in Sanity
    const result = await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id, // Post ID reference
      },
      name,
      email,
      comment,
      approved: true, // Set to false for moderation
    });

    console.log('Comment submitted:', result);

    // Return success response
    return res.status(200).json({
      message: 'Comment submitted successfully!',
      comment: result,
    });
  } catch (err: any) {
    console.error('Error submitting comment:', err.message);
    return res.status(500).json({
      message: "Couldn't submit comment",
      error: err.message,
    });
  }
}
