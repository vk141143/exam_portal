const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const EDGE_FN_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/get-videosdk-token` : "";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

// In-memory token cache for the page session
let _cachedToken: string | null = null;

export async function getVideoSDKToken(): Promise<string> {
  if (_cachedToken) return _cachedToken;

  if (!EDGE_FN_URL || !SUPABASE_ANON_KEY) {
    throw new Error("VideoSDK configuration is incomplete. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  const res = await fetch(EDGE_FN_URL, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch VideoSDK token: ${res.status}`);

  const { token, error } = await res.json();
  if (error) throw new Error(error);

  _cachedToken = token;
  return token;
}

// Called once when admin creates an exam — returns a new VideoSDK roomId
export async function createVideoRoom(): Promise<string> {
  const token = await getVideoSDKToken();

  const res = await fetch("https://api.videosdk.live/v2/rooms", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Failed to create VideoSDK room: ${res.status}`);
  const data = await res.json();
  return data.roomId as string;
}
