import { signIn, signOut, useSession } from "@/lib/auth/client"
import { useNavigate, useLocation } from "@tanstack/react-router"

export default function Component() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: session } = useSession()

  if (session && pathname === "/") navigate({ to: "/dashboard" })
  if (!session && pathname === "/dashboard") navigate({ to: "/" })

  return session ? (
    <>
      <p>Welcome, {session.user.name}.</p>
      <button
        className="cursor-pointer rounded-full border px-4 py-1 text-gray-100 hover:opacity-80"
        onClick={async () => {
          await signOut()
          navigate({ to: "/" })
        }}
      >
        Log Out
      </button>
    </>
  ) : (
    <>
      <p>Please log in to continue.</p>
      <button
        className="cursor-pointer rounded-full border px-4 py-1 text-gray-100 hover:opacity-80"
        onClick={async () =>
          await signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
          })
        }
      >
        Login with Github
      </button>
    </>
  )
}
