import cookie from 'cookie'
import {redirect} from '@sveltejs/kit'

export function hasDecisionBeenSeen(request, social) {
  const cookieHeader = request.headers.get('cookie')
  const cookies = cookie.parse(cookieHeader || '')
  return social.decision !== cookies.decision
}

export function decisionRedirect(socialId) {
  redirect(303, `/${socialId}/decision`);
}
