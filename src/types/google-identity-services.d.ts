interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  width?: number;
  locale?: string;
}

interface GoogleIdentityService {
  initialize(configuration: GoogleIdConfiguration): void;
  renderButton(
    parent: HTMLElement,
    options: GoogleButtonConfiguration,
  ): void;
}

interface Window {
  google?: {
    accounts: {
      id: GoogleIdentityService;
    };
  };
}
