import { ResetPasswordView } from "@/components/account/reset-password-view";

interface ResetPasswordPageProps {
  params: Promise<{ id: string; token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { id, token } = await params;
  return <ResetPasswordView id={id} token={token} />;
}
