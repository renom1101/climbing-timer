import { useEffect, useState } from "react";
import { supabase } from "../data/supabase/client";

function useSession() {
  const [userId, setUserId] = useState<string | undefined>();

  async function getUserId() {
    const { data: sessionData } = await supabase.auth.getSession();

    let userId: string | undefined;

    if (sessionData.session) {
      userId = sessionData.session?.user.id;
    } else {
      const { data } = await supabase.auth.signInAnonymously();
      userId = data?.user?.id;
    }

    return userId;
  }

  useEffect(() => {
    getUserId().then((userId) => setUserId(userId));
  }, []);

  return { userId };
}

export default useSession;
