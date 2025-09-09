"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user to database
      fetch("/api/users/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.warn("User sync failed:", response.status);
          }
        })
        .catch((error) => {
          console.warn("Error syncing user:", error);
        });
    }
  }, [isLoaded, user]);

  return null; // This component doesn't render anything
}
