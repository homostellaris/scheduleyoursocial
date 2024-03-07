import cookie from 'cookie'

export function hasDecisionBeenSeen(request, social) {
  const cookieHeader = request.headers.get('cookie')
  const cookies = cookie.parse(cookieHeader || '')
  return social.decision !== cookies.decision
}

export function decisionRedirect(socialId) {
  return {
    status: 303,
    headers: {
      location: `/${socialId}/decision`,
    },
  }
}
