import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Connexion
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Comptes de démonstration (mot de passe : demo1234) :
        idrissou.baba@agrimarket.bj (éleveur), fabrice.kora@agrimarket.bj
        (acheteur), admin@agrimarket.bj (admin).
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
