"use client";

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useCallback, useState } from "react";
import Script from "next/script";
import { Button, Hr } from 'nes-ui-react';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          cancel: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}

export function GoogleOneTap() {
  const { data: session } = useSession();
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  console.log(session);

  const handleCredentialResponse = useCallback((response: any) => {
    signIn("google", {
      credential: response.credential,
      redirect: false,
    }).catch((error) => {
      console.error("Error signing in:", error);
    });
  }, []);

  const initializeGoogleOneTap = useCallback(() => {
    if (window.google && !session) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
          context: "signin",
          ux_mode: "popup",
          auto_select: false,
          use_fedcm_for_prompt: true,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log(
              "One Tap was not displayed:",
              notification.getNotDisplayedReason()
            );
          } else if (notification.isSkippedMoment()) {
            console.log(
              "One Tap was skipped:",
              notification.getSkippedReason()
            );
          } else if (notification.isDismissedMoment()) {
            console.log(
              "One Tap was dismissed:",
              notification.getDismissedReason()
            );
          }
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "Only one navigator.credentials.get request may be outstanding at one time"
          )
        ) {
          console.log(
            "FedCM request already in progress. Waiting before retrying..."
          );
          setTimeout(initializeGoogleOneTap, 1000);
        } else {
          console.error("Error initializing Google One Tap:", error);
        }
      }
    }
  }, [session, handleCredentialResponse]);

  useEffect(() => {
    if (isGoogleScriptLoaded) {
      initializeGoogleOneTap();
    }
  }, [isGoogleScriptLoaded, initializeGoogleOneTap]);

  useEffect(() => {
    if (session) {
      // If user is signed in, cancel any ongoing One Tap prompts
      window.google?.accounts.id.cancel();
    }
  }, [session]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      async
      defer
      onLoad={() => setIsGoogleScriptLoaded(true)}
      strategy="afterInteractive"
    />
  );
}


export function AuthComponent() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false);

  if (session && session.user) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Button className='w-full' onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }

  const handleLogin = ((provider?: string) => {
    setIsLoading(true);
    signIn(provider);
  })


  return (
    <>
      <Button className='w-full' disabled={isLoading} onClick={() => handleLogin()}>登录 CatLin</Button>
      {/* <Hr className="my-2"/> */}
      {/* <Button className='w-full' disabled={isLoading} onClick={() => handleLogin("google")}>登录 Google</Button> */}
    </>
  )
}