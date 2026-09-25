import { LogOut, RefreshCw } from "lucide-react";

function LogoutModal({
  onClose,
  onConfirm,
  isLoggingOut,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">

        {/* ICON */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <LogOut
            size={20}
            className="text-red-500"
          />
        </div>

        {/* TITLE */}
        <h2 className="mt-4 text-lg font-semibold text-[#173d20]">
          Logout?
        </h2>

        {/* MESSAGE */}
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Are you sure you want to logout from your account?
        </p>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">

          {/* CANCEL */}
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 disabled:opacity-50"
          >
            Cancel
          </button>

          {/* LOGOUT */}
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoggingOut ? (
              <>
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />

                Logging out...
              </>
            ) : (
              <>
                <LogOut size={15} />

                Logout
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

export default LogoutModal;