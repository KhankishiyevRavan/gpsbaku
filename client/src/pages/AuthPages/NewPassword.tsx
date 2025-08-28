import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import NewPasswordForm from "../../components/auth/NewPasswordForm";

export default function NewPassword() {
  return (
    <>
      <PageMeta
        title="GPSBAKU.AZ | Şifrəni yenilə"
        description="Bu səhifə GPSBAKU.AZ şifrə yeniləmə səhifəsidir."
      />
      <AuthLayout>
        <NewPasswordForm />
      </AuthLayout>
    </>
  );
}
