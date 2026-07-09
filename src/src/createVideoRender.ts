import { supabase } from "@/integrations/supabase/client";
import { generateRunwayVideo, pollRunwayTask } from "@/server/runway";

export async function createVideoRender(userId: string, prompt: string) {
  // 1. Save job in database
  const { data: render } = await supabase
    .from("renders")
    .insert({
      user_id: userId,
      prompt,
      status: "processing",
    })
    .select()
    .single();

  // 2. Call Runway
  const job = await generateRunwayVideo(prompt);

  // 3. Wait for video
  const videoUrl = await pollRunwayTask(job.id);

  // 4. Save result
  await supabase
    .from("renders")
    .update({
      status: "done",
      video_url: videoUrl,
    })
    .eq("id", render.id);

  return videoUrl;
}
