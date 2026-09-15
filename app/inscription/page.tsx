import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Créer un compte
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Gratuit, en moins d&apos;une minute.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
