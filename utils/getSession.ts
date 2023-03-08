// Module Next-Session ajouté au projet pour créer et conserver session de l'utilisateur
// Documentation: https://github.com/hoangvvo/next-session

import nextSession from "next-session";
import SessionStore from "./session-store";

const store = new SessionStore();
export const getSession = nextSession({store});
