const BEARER_PREFIX = "Bearer ";

export function toAuthorizationHeader(
  accessToken: string | null | undefined,
): string | undefined {
  const normalizedToken = accessToken?.trim();

  return normalizedToken
    ? `${BEARER_PREFIX}${normalizedToken}`
    : undefined;
}
