import type { NextApiRequest, NextApiResponse } from 'next';

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string, errors: string[] }>
) {

  try {
    const { lastName, firstName, email, accountType, password, confPassword, dateOfBirth} = req.body // arguments reçu du form dans signupForm.tsx
    const emailReg = /@/;

    if (password !== confPassword) {
      res.status(400).json({ status: "erreur", errors: ["Les deux mots de passe ne sont pas identiques"] })
      return
    }
    else if (emailReg.test(email) == false) {
      res.status(400).json({ status: "erreur", errors: ["Le courriel n'est pas valide"] })
      return
    }

    console.log("User has been saved");

    return res.json({ status: "success", errors: [] })

  } catch (error) {
    return res.status(500).send(error.toString())
  }
}
