import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseClient } from '../../utils/supabaseClient'

export default function AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  supabaseClient.auth.api.setAuthCookie(req, res)
}
