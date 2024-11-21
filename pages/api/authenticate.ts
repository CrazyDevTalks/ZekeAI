import { DeepgramError, createClient } from "@deepgram/sdk";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Development mode - return the API key directly
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      key: process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "",
    });
  }

  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

    let { result: projectsResult, error: projectsError } =
      await deepgram.manage.getProjects();

    if (projectsError) {
      console.error('Projects error:', projectsError);
      return res.status(500).json({ error: projectsError });
    }

    const project = projectsResult?.projects[0];

    if (!project) {
      return res.status(404).json({
        error: "Cannot find a Deepgram project. Please create a project first."
      });
    }

    let { result: newKeyResult, error: newKeyError } =
      await deepgram.manage.createProjectKey(project.project_id, {
        comment: "Temporary API key",
        scopes: ["usage:write"],
        tags: ["next.js"],
        time_to_live_in_seconds: 60,
      });

    if (newKeyError) {
      console.error('New key error:', newKeyError);
      return res.status(500).json({ error: newKeyError });
    }

    // Set cache control headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json({ key: newKeyResult.key });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Failed to get Deepgram key' });
  }
} 