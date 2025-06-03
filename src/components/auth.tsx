import { useSession } from "@/lib/auth/client"
import { Link } from "@tanstack/react-router"
import { signIn, signOut } from "@/lib/auth/client"
import { useNavigate, useLocation } from "@tanstack/react-router"

export default function Component() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: session } = useSession()

  if (!session && pathname === "/dashboard") navigate({ to: "/" })

  return session ? (
    pathname !== "/dashboard" ? (
      <>
        <p>You are logged in!</p>
        <Link
          className="rounded-full bg-gray-100 px-4 py-1 text-gray-900 hover:opacity-80"
          to="/dashboard"
        >
          Proceed to Dashboard
        </Link>
      </>
    ) : (
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
    )
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
