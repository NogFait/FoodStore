import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await register({
        username: value.username,
        full_name: value.full_name,
        email: value.email,
        password: value.password,
      });
      navigate("/login");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md min-h-[480px] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-indigo-200 text-sm mt-1">Registrate en TiendaOnline</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? { message: "El usuario es obligatorio" } : undefined,
              }}
              children={(field) => (
                <>
                  <input
                    type="text"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="ej: juanperez"
                  />
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <form.Field
              name="full_name"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? { message: "El nombre es obligatorio" } : undefined,
              }}
              children={(field) => (
                <>
                  <input
                    type="text"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="ej: Juan Pérez"
                  />
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim()
                    ? { message: "El email es obligatorio" }
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? { message: "Email inválido" }
                    : undefined,
              }}
              children={(field) => (
                <>
                  <input
                    type="email"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="ej: juan@email.com"
                  />
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? { message: "La contraseña es obligatoria" }
                    : value.length < 8
                    ? { message: "Mínimo 8 caracteres" }
                    : undefined,
              }}
              children={(field) => (
                <>
                  <input
                    type="password"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Mínimo 8 caracteres"
                  />
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Crear Cuenta"}
              </button>
            )}
          />

          <p className="text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
