import { Router } from 'express'

export default function (router: Router): void {
  router.post('/signup', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
