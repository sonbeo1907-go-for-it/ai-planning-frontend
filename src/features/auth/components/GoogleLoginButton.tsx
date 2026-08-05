"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Script from "next/script";

import { env } from "@/lib/env";

export interface GoogleLoginButtonProps {
  disabled?: boolean;
  onCredential: (idToken: string) => void;
  onError: (message: string) => void;
}

export function GoogleLoginButton({
  disabled = false,
  onCredential,
  onError,
}: GoogleLoginButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  const [isSdkReady, setIsSdkReady] = useState(false);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const container = buttonContainerRef.current;
    const googleIdentityService = window.google?.accounts.id;

    if (
      !env.googleClientId
      || !isSdkReady
      || !container
      || !googleIdentityService
    ) {
      return;
    }

    googleIdentityService.initialize({
      client_id: env.googleClientId,
      callback: ({ credential }) => {
        if (!credential) {
          onErrorRef.current(
            "Google không trả về thông tin đăng nhập. Vui lòng thử lại.",
          );
          return;
        }

        onCredentialRef.current(credential);
      },
    });

    container.replaceChildren();
    googleIdentityService.renderButton(container, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 320,
      locale: "vi",
    });
  }, [isSdkReady]);

  if (!env.googleClientId) {
    return null;
  }

  return (
    <div
      aria-busy={disabled}
      className={disabled ? "pointer-events-none opacity-50" : undefined}
    >
      <Script
        id="google-identity-services"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => {
          if (window.google?.accounts.id) {
            setIsSdkReady(true);
            return;
          }

          onErrorRef.current(
            "Không thể khởi tạo đăng nhập Google. Vui lòng thử lại.",
          );
        }}
        onError={() => onErrorRef.current("Không thể tải đăng nhập Google. Vui lòng thử lại.")}
      />
      <div ref={buttonContainerRef} className="flex justify-center" />
    </div>
  );
}
