import { DeepgramError, createClient } from "@deepgram/sdk";

export const getDeepgramKey = async (): Promise<string> => {
  // Development mode check
  if (process.env.N === "development") {
    return process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";
  }

  try {
    const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "");

    // Get projects
    const { result: projectsResult, error: projectsError } =
      await deepgram.manage.getProjects();

    if (projectsError) {
      console.error('Projects error:', projectsError);
      throw projectsError;
    }

    const project = projectsResult?.projects[0];

    if (!project) {
      throw new DeepgramError(
        "Cannot find a Deepgram project. Please create a project first."
      );
    }

    // Create temporary key
    const { result: newKeyResult, error: newKeyError } =
      await deepgram.manage.createProjectKey(project.project_id, {
        comment: "Temporary API key",
        scopes: ["usage:write"],
        tags: ["next.js"],
        time_to_live_in_seconds: 60,
      });

    if (newKeyError) {
      console.error('New key error:', newKeyError);
      throw newKeyError;
    }

    return newKeyResult.key;

  } catch (error) {
    console.error('Deepgram service error:', error);
    // Fallback to public key in case of errors
    return process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";
  }
};

// Add cache control headers to fetch requests
export const fetchWithNoCache = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}; 