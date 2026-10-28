export type SignupDraft = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

let signupDraft: SignupDraft | null = null;

export function saveSignupDraft(draft: SignupDraft) {
  signupDraft = draft;
}

export function getSignupDraft() {
  return signupDraft;
}

export function clearSignupDraft() {
  signupDraft = null;
}
